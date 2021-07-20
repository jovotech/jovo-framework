import * as ua from 'universal-analytics';
import _merge = require('lodash.merge');
import * as crypto from 'crypto';
import { Analytics, BaseApp, ErrorCode, HandleRequest, JovoError, Log } from 'jovo-core';
import { Jovo } from 'jovo-framework';
import {
  Config,
  Event,
  TransactionItem,
  Transaction,
  validEndReasons,
  systemMetricNames,
  systemDimensionNames,
  SystemMetricNamesEnum,
  SystemDimensionNameEnum,
} from './interfaces';
import { Helper } from './helper';
import { GoogleAnalyticsInstance } from './GoogleAnalyticsInstance';

export class GoogleAnalytics implements Analytics {
  /**
   * Need to save start state -\> will change during handling
   * Need to save lastUsed for calculation timeouts (sessionEnded bug display devices)
   *
   * @param handleRequest - jovo HandleRequest objekt
   */
  static saveStartStateAndLastUsed(handleRequest: HandleRequest): void {
    const { jovo } = handleRequest;

    if (jovo) {
      const stateString: string = jovo.getState() ? jovo.getState() : '/';

      jovo.$data.startState = stateString;
      jovo.$data.lastUsedAt = jovo?.$user.$metaData?.lastUsedAt;
    }
  }

  /**
   * Get end reason from session variables
   *
   * @param jovo - unser liebes Jovo objekt.
   * @returns - the endreason saved in the session data.
   */
  static getEndReason(jovo: Jovo): validEndReasons | undefined {
    const endReason: validEndReasons | undefined = jovo.$session.$data.endReason;
    return endReason;
  }

  config: Config = {
    trackingId: '',
    enableAutomaticEvents: true,
    trackEndReasons: false,
    sessionTimeoutInMinutes: 5,
    skipUnverifiedUser: true,
    validateCustomDefinitions: false,
    customMetricMap: [
      ['Stop', 1],
      ['ERROR', 2],
      ['EXCEEDED_MAX_REPROMPTS', 3],
      // ['PlayTimeLimitReached', 4],
      ['USER_INITIATED', 5],
      ['undefined', 6],
    ],
    customDimensionMap: [['UUID', 1]],
  };

  // this map can be overwritten by skill developers to map endreasons to different custom metric numbers
  protected customMetricsIndicesMap: Map<systemMetricNames, number> = new Map<
    systemMetricNames,
    number
  >();
  protected customDimensionsIndicesMap: Map<systemDimensionNames, number> = new Map<
    systemDimensionNames,
    number
  >();

  protected visitor: ua.Visitor | undefined;

  /**
   * Validates if all members in a list of names is defined in the skills/actions custom metric map (in config file).
   * Can be used after the setup middleware -> config is not loaded before
   * @param neededMetricNames list of name to check against config
   */
  validateSkillConfigsCustomMetrics(neededMetricNames: string[]) {
    this.checkForMissingCustomEntriesInConfig('metric', neededMetricNames);
    this.checkAllCustomEntrieValuesAreUnique('metric');
  }

  /**
   * Validates if all members in a list of names is defined in the skills/actions custom dimension map (in config file).
   * Can be used after the setup middleware -> config is not loaded before
   * @param neededDimensionNames list of name to check against config
   */
  validateSkillConfigsCustomDimensions(neededDimensionNames: string[]) {
    this.checkForMissingCustomEntriesInConfig('dimension', neededDimensionNames);
    this.checkAllCustomEntrieValuesAreUnique('dimension');
  }

  install(app: BaseApp) {
    if (!this.config.trackingId) {
      throw new JovoError(
        `trackingId has to be set for ${this.constructor.name}.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
        '',
        'You can find your tracking id in Google Analytics by clicking: Admin -> Property Settings -> Tracking Id',
        'https://www.jovo.tech/docs/analytics/googleanalytics',
      );
    }

    this.customMetricsIndicesMap = new Map<systemMetricNames, number>(this.config.customMetricMap);
    this.customDimensionsIndicesMap = new Map<systemDimensionNames, number>(
      this.config.customDimensionMap,
    );

    if (this.config.validateCustomDefinitions) {
      this.validateSkillConfigsCustomMetrics(Object.keys(SystemMetricNamesEnum));
      this.validateSkillConfigsCustomDimensions(Object.keys(SystemDimensionNameEnum));
    }

    app.middleware('before.handler')!.use(GoogleAnalytics.saveStartStateAndLastUsed.bind(this));
    app.middleware('after.platform.init')!.use(this.setGoogleAnalyticsObject.bind(this));
    app.middleware('before.response')!.use(this.track.bind(this));
    app.middleware('fail')!.use(this.sendError.bind(this));
  }

  /**
   * Sets end reason to session variables + updates google analytics metric
   *
   * @param jovo - unser liebes Jovo objekt
   * @param endReason - grund für session ende
   */
  setEndReason(jovo: Jovo, endReason: validEndReasons): void {
    jovo.$session.$data.endReason = endReason;
    const gaMetricNumber = this.customMetricsIndicesMap.get(endReason);
    if (gaMetricNumber) {
      jovo.$googleAnalytics.setCustomMetric(gaMetricNumber, '1');
    } else {
      const undefinedMetricNumber = this.customMetricsIndicesMap.get('undefined');
      if (undefinedMetricNumber) {
        jovo.$googleAnalytics.setCustomMetric(undefinedMetricNumber, '1');
      }
    }
  }

  /**
   * Auto send intent data after each response. Also setting sessions and flowErrors
   * @param handleRequest
   */
  async track(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    if (
      Helper.getDiffToLastVisitInMinutes(jovo) > this.config.sessionTimeoutInMinutes &&
      !jovo.isNewSession()
    ) {
      return;
    }

    // Validate current request type
    const { type: requestType } = jovo.getRoute();
    const invalidRequestTypes = ['AUDIOPLAYER'];
    if (!this.config.trackDirectives && invalidRequestTypes.includes(requestType)) {
      return;
    }

    // Either start or stop the session. If sessionTag is undefined, it will be ignored.
    const sessionTag = this.getSessionTag(jovo);
    jovo.$googleAnalytics.visitor!.set('sessionControl', sessionTag);

    // Track intent data.
    const pageview = jovo.$googleAnalytics.visitor!.pageview(this.getPageParameters(jovo));

    if (this.config.enableAutomaticEvents) {
      // Detect and send FlowErrors
      this.sendUnhandledEvents(jovo);
      this.sendIntentInputEvents(jovo);
    }

    return new Promise((resolve, reject) => {
      jovo.$googleAnalytics.visitor?.send((error, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  protected checkForMissingCustomEntriesInConfig(
    customTypeToCheck: 'dimension' | 'metric',
    neededCustomEntries: string[],
  ) {
    const entrieKeysInInstance =
      customTypeToCheck === 'metric'
        ? ([...this.customMetricsIndicesMap.keys()] as string[])
        : ([...this.customDimensionsIndicesMap.keys()] as string[]);
    Log.debug(`keys zu prüfen: ${neededCustomEntries}`);
    Log.debug(`keys in instanz: ${entrieKeysInInstance}`);

    const missingEntriesInConfig = neededCustomEntries.filter(
      (entrieToCheck) => !entrieKeysInInstance.includes(entrieToCheck),
    );

    if (missingEntriesInConfig?.length > 0) {
      // TODO: add dimension check
      throw new JovoError(
        `Missing config values for custom ${customTypeToCheck} set by system`,
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
        `Missing ${customTypeToCheck}: ${missingEntriesInConfig}`,
        'All custom dimension and metrics set by system can be found on our documentation.',
        'https://www.jovo.tech/docs/analytics/googleanalytics',
      );
    }
  }

  protected checkAllCustomEntrieValuesAreUnique(customTypeToCheck: 'dimension' | 'metric') {
    const entrieValuesInInstance =
      customTypeToCheck === 'metric'
        ? ([...this.customMetricsIndicesMap.values()] as number[])
        : ([...this.customDimensionsIndicesMap.values()] as number[]);
    const duplicates = entrieValuesInInstance
      .filter(
        (currentDefinitionValue, index) =>
          entrieValuesInInstance.indexOf(currentDefinitionValue) !== index,
      )
      .filter((currentDefinitionValue) => currentDefinitionValue !== 0);
    if (duplicates?.length > 0) {
      // TODO: add dimension check
      throw new JovoError(
        `Some custom ${customTypeToCheck} in your config have overlapping values`,
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
        `Multiple time used  ${customTypeToCheck} values: ${duplicates.toString()}`,
        `Alter your config to make sure that each custom ${customTypeToCheck} is mapped to a unique value. 
        Index numbers for your google analytics project can be found on your analytics website under "settings" -> "custom definitions".`,
        'https://www.jovo.tech/docs/analytics/googleanalytics',
      );
    }
  }

  /**
   * Initiates GoogleAnalytics visitor object with fixed parameters.
   * @param {object} jovo: Jovo object for data like language or platform
   */
  protected initVisitor(jovo: Jovo) {
    const uuid = this.getUserId(jovo);

    // Initialize visitor with account id and custom client id
    this.visitor = ua(this.config.trackingId, uuid, { strictCidFormat: false });
    this.visitor.set('userId', uuid);
    this.visitor.set('dataSource', jovo.getType());
    this.visitor.set('userLanguage', jovo.getLocale());
  }

  /**
   * Tracks uncaught user exceptions.
   * @param {object} handleRequest: HandleRequest to act upon
   */
  protected sendError(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (!jovo) {
      // don't send anything
      return;
    }

    // Stop the current tracking session.
    jovo.$googleAnalytics.visitor!.set('sessionControl', 'end');
    jovo.$googleAnalytics
      .visitor!.pageview(this.getPageParameters(jovo), (err: any) => {
        if (err) {
          throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
      })
      .exception(handleRequest.error!.name)
      .send();
  }

  /**
   * Detects and sends flow errors, ranging from nlu errors to bugs in the skill handler.
   * @param {object} jovo: Jovo object
   */
  protected sendUnhandledEvents(jovo: Jovo) {
    const intent = jovo.$request!.getIntentName();
    const { path } = jovo.getRoute();

    // Check if an error in the nlu model occurred.
    if (intent === 'AMAZON.FallbackIntent' || intent === 'Default Fallback Intent') {
      return jovo.$googleAnalytics.sendUserEvent('UnhandledEvents', 'NLU_Unhandled');
    }

    // If the current path is unhandled, an error in the skill handler occurred.
    if (path.endsWith('Unhandled')) {
      return jovo.$googleAnalytics.sendUserEvent('UnhandledEvents', 'Skill_Unhandled');
    }
  }

  /**
   * Extract input from intent + send to googleAnalytics via events
   * @param jovo Jovo object
   */
  protected sendIntentInputEvents(jovo: Jovo) {
    if (jovo.$inputs) {
      for (const [key, value] of Object.entries(jovo.$inputs)) {
        if (!value.key) {
          continue;
        }

        const params: Event = {
          eventCategory: 'Inputs',
          eventAction: value.key, // Input value
          eventLabel: key, // Input key
        };
        jovo.$googleAnalytics.visitor!.event(params);
      }
    }
  }

  /**
   * Construct pageview parameters, a.k.a intent tracking data.
   * @param {object} jovo: Jovo object
   * @returns {object} pageParameters: Intent data to track
   */
  protected getPageParameters(jovo: Jovo) {
    const intentType = jovo.$type.type ?? 'fallBackType';
    const intentName = jovo.$request?.getIntentName();
    const customParameters = jovo.$googleAnalytics.$parameters;

    return {
      documentPath: this.getPageName(jovo),
      documentHostName: jovo.$data.startState ? jovo.$data.startState : '/',
      documentTitle: intentName || intentType,
      ...customParameters,
    };
  }

  /**
   * Change state to startState + root intent (not mappedIntent)
   *
   * @param jovo - unser liebes Jovo objekt
   * @override
   */
  protected getPageName(jovo: Jovo): string {
    const endReason =
      this.getSessionTag(jovo) === 'end' && GoogleAnalytics.getEndReason(jovo)
        ? GoogleAnalytics.getEndReason(jovo)
        : jovo.$type.type;

    const intentName = jovo.$request?.getIntentName() ? jovo.$request?.getIntentName() : endReason;
    const state = jovo.$data.startState ? jovo.$data.startState : '/';
    return `${state}.${intentName}`;
  }

  /**
   * Generates hash for userId.
   * @param {object} jovo: Jovo object
   * @returns {string} uuid: Hashed user id
   */
  protected getUserId(jovo: Jovo): string {
    const userId = jovo.$user.getId();
    if (!userId) return 'UKNOWN_USER';

    const idHash = crypto.createHash('sha256').update(userId).digest('base64');
    return idHash;
  }

  /**
   * Checks if the current session started or ended.
   * @param {object} jovo: Jovo object
   * @returns {string | void} sessionTag: Corresponding session tag (start|end|undefined)
   */
  protected getSessionTag(jovo: Jovo): string | void {
    if (
      jovo.getMappedIntentName() === 'END' ||
      jovo.$type.type === 'END' ||
      (jovo.$response && jovo.$response.isTell())
    ) {
      return 'end';
    }

    if (jovo.isNewSession()) {
      return 'start';
    }
  }

  /**
   * Sets the analytics variable to the instance of this object for making it accessable in skill code
   * @param handleRequest
   */
  protected setGoogleAnalyticsObject(handleRequest: HandleRequest) {
    const jovo = handleRequest.jovo;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    this.initVisitor(jovo);

    if (!this.visitor) {
      throw new JovoError(
        'Not able to set $googleanalytics. Visitor is not initialized. Check the initVisitor method.',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    const userId = this.getUserId(jovo);

    // Initialise googleAnalytics object.
    jovo.$googleAnalytics = new GoogleAnalyticsInstance(jovo, this.config, userId, this.visitor);
    jovo.$googleAnalytics.setCustomDimensionByName('UUID', userId);
  }
}
