import _get = require('lodash.get');
import { ErrorCode, HandleRequest, Jovo, JovoError, BaseApp } from 'jovo-core';
import { AlexaRequest } from 'jovo-platform-alexa';
import { GoogleAnalytics } from './GoogleAnalytics';

export class GoogleAnalyticsAlexa extends GoogleAnalytics {
  install(app: BaseApp) {
    app.middleware('after.handler')?.use(this.setErrorEndReason.bind(this));
    super.install(app);
  }

  async track(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    if (jovo.constructor.name !== 'AlexaSkill') {
      return;
    }

    const alexaRequest = jovo.$request as AlexaRequest;

    if (jovo.$type.subType?.includes('AlexaSkillEvent')) {
      await this.handleAlexaSkillEvents(jovo);
      return;
    }

    await super.track(handleRequest);
  }

  protected async handleAlexaSkillEvents(jovo: Jovo) {
    const eventName = jovo.$type.subType?.split('.')[1];
    if (!eventName) {
      return;
    }

    return jovo.$googleAnalytics.sendEvent({
      eventCategory: 'AlexaSkillEvent',
      eventAction: eventName,
      eventLabel: this.getUserId(jovo),
    });
  }

  protected async sendError(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (jovo?.constructor.name !== 'AlexaSkill') {
      // don't send anything
      return;
    }
    await super.sendError(handleRequest);
  }

  protected setGoogleAnalyticsObject(handleRequest: HandleRequest) {
    const jovo: Jovo = handleRequest.jovo!;
    if (!jovo) {
      throw new JovoError(
        'Jovo object is not set',
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
      );
    }

    if (jovo.constructor.name !== 'AlexaSkill') {
      return;
    }

    super.setGoogleAnalyticsObject(handleRequest);
  }

  protected setErrorEndReason(handleRequest: HandleRequest): void {
    const { jovo } = handleRequest;
    if (!jovo) {
      return;
    }
    const endReason = jovo.$alexaSkill?.getEndReason();

    const responseWillEndSessionWithTell =
      _get(jovo.$output, 'Alexa.tell') || _get(jovo.$output, 'tell'); // aus AlexaCore.ts Zeile 95
    if (this.config.trackEndReasons && endReason) {
      // set End Reason (eg. ERROR, EXCEEDED_MAX_REPROMPTS, PLAYTIME_LIMIT_REACHED, USER_INITIATED, ...)
      this.setEndReason(jovo, endReason);
    } else if (responseWillEndSessionWithTell) {
      this.setEndReason(jovo, 'Stop');
    }
  }

  protected async enqueUnhandledEvents(jovo: Jovo) {
    if (jovo.$alexaSkill!.getEndReason() === 'EXCEEDED_MAX_REPROMPTS') {
      await jovo.$googleAnalytics.sendUserEvent('FlowError', 'Exceeded_Max_Reprompts');
    }
    return super.enqueueUnhandledEvents(jovo);
  }

  protected initVisitor(jovo: Jovo) {
    super.initVisitor(jovo);

    const request = jovo.$request as AlexaRequest;
    const deviceInfo = request.getDeviceName();
    this.visitor!.set('screenResolution', request.getScreenResolution!());

    // fake UserAgent which makes GA mappping device to browser field and platform type to mobile
    this.visitor!.set(
      'userAgentOverride',
      `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`,
    );

    const referrer = _get(request, 'request.metadata.referrer');
    if (referrer) {
      this.visitor!.set('campaignMedium', 'referral');
      this.visitor!.set('campaignSource', referrer);
      this.visitor!.set('documentReferrer', referrer);
    }
  }

  /**
   * Checks if the current session started or ended. For Alexa do not count Audioplayer Events as new sessions.
   *
   * @param jovo - Unser Jovo objekt
   * @returns sessionTag: Corresponding session tag (start|end|undefined)
   */
  // eslint-disable-next-line class-methods-use-this
  protected getSessionTag(jovo: Jovo): string | void {
    const { type: requestType } = jovo.getRoute();
    const isAudioPlayerRequest = ['AUDIOPLAYER'];
    if (isAudioPlayerRequest.includes(requestType)) {
      return undefined;
    }
    return super.getSessionTag(jovo);
  }
}
