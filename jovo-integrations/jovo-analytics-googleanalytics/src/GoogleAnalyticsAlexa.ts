import _get = require('lodash.get');
import { ErrorCode, HandleRequest, Jovo, JovoError, BaseApp } from 'jovo-core';
import { AlexaRequest } from 'jovo-platform-alexa';
import { GoogleAnalytics } from './GoogleAnalytics';

export class GoogleAnalyticsAlexa extends GoogleAnalytics {
  public install(app: BaseApp) {
    app.middleware('after.handler')?.use(this.setErrorEndReason.bind(this));
    super.install(app);
  }

  public track(handleRequest: HandleRequest) {
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

    super.track(handleRequest);
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

  setGoogleAnalyticsObject(handleRequest: HandleRequest) {
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

  setErrorEndReason(handleRequest: HandleRequest): void {
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

  sendUnhandledEvents(jovo: Jovo) {
    super.sendUnhandledEvents(jovo);

    if (jovo.$alexaSkill!.getEndReason() === 'EXCEEDED_MAX_REPROMPTS') {
      this.sendUserEvent(jovo, 'FlowError', 'Exceeded_Max_Reprompts');
    }
  }
}
