import * as ua from 'universal-analytics';
import _merge = require('lodash.merge');
import * as murmurhash from 'murmurhash';
import { Analytics, BaseApp, ErrorCode, HandleRequest, Jovo, JovoError } from 'jovo-core';
import { Config, Event, TransactionItem, Transaction } from './interfaces';

export class GoogleAnalytics implements Analytics {
  config: Config = {
    trackingId: '',
  };
  visitor: ua.Visitor | undefined;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp) {
    if (!this.config.trackingId) {
      throw new JovoError(
        'trackingId has to be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
        '',
        'You can find your tracking id in Google Analytics by clicking: Admin -> Property Settings -> Tracking Id',
        'https://www.jovo.tech/docs/analytics/googleanalytics',
      );
    }

    app.middleware('after.platform.init')!.use(this.setGoogleAnalyticsObject.bind(this));
    app.middleware('after.response')!.use(this.track.bind(this));
    app.middleware('fail')!.use(this.sendError.bind(this));
  }

  /**
   * Auto send intent data after each response. Also setting sessions and flowErrors
   * @param handleRequest
   */
  track(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    // Validate current request type
    const { type: requestType } = jovo.getRoute();
    const invalidRequestTypes = ['AUDIOPLAYER'];
    if (!this.config.trackDirectives && invalidRequestTypes.includes(requestType)) {
      return;
    }

    // Eiter start or stop the session. If sessionTag is undefined, it will be ignored.
    const sessionTag = this.getSessionTag(jovo);
    this.visitor!.set('sessionControl', sessionTag);

    // Track custom set data as custom metrics.
    const customData = jovo.$googleAnalytics.$data;
    for (const [key, value] of Object.entries(customData)) {
      if (key.startsWith('cm')) {
        this.visitor!.set(key, value);
      }
    }

    // Track intent data.
    this.visitor!.pageview(this.getPageParameters(jovo), (err: any) => {
      if (err) {
        throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
      }
    }).send();

    // Detect and send FlowErrors
    this.sendUnhandledEvents(jovo);

    if (jovo.$inputs) {
      for (const [key, value] of Object.entries(jovo.$inputs)) {
        if (!value.key) {
          continue;
        }

        const params: Event = {
          eventCategory: 'Inputs',
          eventAction: value.key, // Input value
          eventLabel: key, // Input key
          documentPath: jovo.getRoute().path,
        };
        this.visitor!.event(params, (err: any) => {
          if (err) {
            throw new JovoError(
              err.message,
              ErrorCode.ERR_PLUGIN,
              'jovo-analytics-googleanalytics',
            );
          }
        }).send();
      }
    }
  }

  /**
   * Initiates GoogleAnalytics visitor object with fixed parameters.
   * @param {object} jovo: Jovo object for data like language or platform
   */
  initVisitor(jovo: Jovo) {
    const uuid = this.getUserId(jovo);

    // Initialize visitor with account id and custom client id
    const visitor = ua(this.config.trackingId, uuid, { strictCidFormat: false });
    visitor.set('userId', uuid);
    visitor.set('dataSource', jovo.getType());
    visitor.set('userLanguage', jovo.getLocale());
    // Set user id as a custom dimension to track hits on the same scope
    visitor.set('cd1', uuid);

    this.visitor = visitor;
  }

  /**
   * Tracks uncaught user exceptions.
   * @param {object} handleRequest: HandleRequest to act upon
   */
  sendError(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    // Stop the current tracking session.
    this.visitor!.set('sessionControl', 'end');
    this.visitor!.pageview(this.getPageParameters(jovo), (err: any) => {
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
  sendUnhandledEvents(jovo: Jovo) {
    const intent = jovo.$request!.getIntentName();
    const { path } = jovo.getRoute();

    // Check if an error in the nlu model occurred.
    if (intent === 'AMAZON.FallbackIntent' || intent === 'Default Fallback Intent') {
      return this.sendUserEvent(jovo, 'UnhandledEvents', 'NLU_Unhandled');
    }

    // If the current path is unhandled, an error in the skill handler occurred.
    if (path.endsWith('Unhandled')) {
      return this.sendUserEvent(jovo, 'UnhandledEvents', 'Skill_Unhandled');
    }
  }

  /**
   * Construct pageview parameters, a.k.a intent tracking data.
   * @param {object} jovo: Jovo object
   * @returns {object} pageParameters: Intent data to track
   */
  getPageParameters(jovo: Jovo) {
    const { intent, path, type } = jovo.getRoute();
    return {
      documentPath: path,
      documentHostName: type,
      documentTitle: intent || type,
    };
  }

  /**
   * Generates hash for userId.
   * @param {object} jovo: Jovo object
   * @returns {string} uuid: Hashed user id
   */
  getUserId(jovo: Jovo): string {
    const idHash = murmurhash.v3(jovo.$user.getId()!);
    const uuid = idHash.toString();
    return uuid;
  }

  /**
   * Checks if the current session started or ended.
   * @param {object} jovo: Jovo object
   * @returns {string | void} sessionTag: Corresponding session tag (start|end|undefined)
   */
  getSessionTag(jovo: Jovo): string | void {
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
   * User Events ties users to event category and action
   * @param {object} jovo: Jovo object
   * @param {string} eventName maps to category -> eventGroup
   * @param {string} eventElement maps to action -> instance of eventGroup
   */
  sendUserEvent(jovo: Jovo, eventCategory: string, eventAction: string) {
    const params: Event = {
      eventCategory,
      eventAction,
      eventLabel: this.getUserId(jovo),
      documentPath: jovo.getRoute().path,
    };

    this.visitor!.event(params, (err: any) => {
      if (err) {
        throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
      }
    }).send();
  }

  /**
   * Sets the analytics variable to the instance of this object for making it accessable in skill code
   * @param handleRequest
   */
  setGoogleAnalyticsObject(handleRequest: HandleRequest) {
    const jovo = handleRequest.jovo;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    // Initialise visitor object.
    this.initVisitor(jovo);

    // Initialise googleAnalytics object.
    jovo.$googleAnalytics = {
      $data: {},
      sendEvent: (params: Event) => {
        this.visitor!.event(params, (err: any) => {
          if (err) {
            throw new JovoError(
              err.message,
              ErrorCode.ERR_PLUGIN,
              'jovo-analytics-googleanalytics',
            );
          }
        }).send();
      },
      sendTransaction: (params: Transaction) => {
        this.visitor!.transaction(params, (err: any) => {
          if (err) {
            throw new JovoError(
              err.message,
              ErrorCode.ERR_PLUGIN,
              'jovo-analytics-googleanalytics',
            );
          }
        }).send();
      },
      sendItem: (params: TransactionItem) => {
        this.visitor!.transaction(params, (err: any) => {
          if (err) {
            throw new JovoError(
              err.message,
              ErrorCode.ERR_PLUGIN,
              'jovo-analytics-googleanalytics',
            );
          }
        }).send();
      },
      sendUserEvent: (eventCategory: string, eventAction: string) => {
        this.sendUserEvent(jovo, eventCategory, eventAction);
      },
      setCustomMetric(index: number, value: string | number) {
        this.$data[`cm${index}`] = value;
      },
    };
  }
}
