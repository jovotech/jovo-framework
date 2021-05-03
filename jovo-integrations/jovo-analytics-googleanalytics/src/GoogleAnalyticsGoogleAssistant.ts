import { GoogleAnalytics } from './GoogleAnalytics';
import { GoogleActionRequest } from 'jovo-platform-googleassistant';
import { DialogflowRequest } from 'jovo-platform-dialogflow';
import { HandleRequest, Jovo, JovoError, ErrorCode } from 'jovo-core';
import { get } from 'lodash';
import { Helper } from './helper';

export class GoogleAnalyticsGoogleAssistant extends GoogleAnalytics {
  static isCrawler(jovo: Jovo) {
    if (!jovo.$googleAction) {
      return false;
    }

    if (GoogleAnalyticsGoogleAssistant.isNativeGoogleRequest(jovo)) {
      if (jovo.$host.$request?.handler?.name === 'actions.handler.HEALTH_CHECK') {
        return true;
      }
      return false;
    } else {
      const dialogFlowRequest = jovo.$request as DialogflowRequest;
      const userName: string | undefined = get(
        dialogFlowRequest.originalDetectIntentRequest!.payload,
        'user.profile.familyName',
      );
      const isCrawler = userName && userName === 'Crawler';
      return isCrawler;
    }
  }

  static isVoiceMatchUser(jovo: Jovo) {
    if (!jovo.$googleAction) {
      return false;
    }

    if (GoogleAnalyticsGoogleAssistant.isNativeGoogleRequest(jovo)) {
      if (jovo.$host.$request?.user?.verificationStatus === 'VERIFIED') {
        return true;
      }
      return false;
    } else {
      const dialogFlowRequest = jovo.$request as DialogflowRequest;
      const userVerificationStatus: string | undefined = get(
        dialogFlowRequest.originalDetectIntentRequest!.payload,
        'user.userVerificationStatus',
      ); //  inputs[0].rawInputs[0].inputType');
      const isVoiceMatchUser = userVerificationStatus && userVerificationStatus === 'VERIFIED';
      return isVoiceMatchUser;
    }
  }

  /**
   * Checks of current request belongs to conversational action
   *
   * @returns true no extra NLU (dialogflow etc)
   */
  static isNativeGoogleRequest(jovo: Jovo) {
    const requestContainsSubRequest: string | undefined = get(
      jovo.$request,
      'originalDetectIntentRequest',
    );
    return !requestContainsSubRequest;
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

    if (jovo.constructor.name !== 'GoogleAction') {
      return;
    }

    if (GoogleAnalyticsGoogleAssistant.isCrawler(jovo)) {
      return;
    }

    if (this.config.skipUnverifiedUser) {
      const isVoiceMatchUser = GoogleAnalyticsGoogleAssistant.isVoiceMatchUser(jovo);
      if (!isVoiceMatchUser) {
        return;
      }
    }
    await super.track(handleRequest);
  }

  initVisitor(jovo: Jovo) {
    super.initVisitor(jovo);

    const request = jovo.$request as GoogleActionRequest;
    const deviceInfo = `Google Assistant Device - ${
      request.hasScreenInterface() ? 'Display Support' : 'Voice Only'
    }`;

    // fake UserAgent which makes GA mappping device to browser field and platform type to mobile
    this.visitor!.set(
      'userAgentOverride',
      `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`,
    );
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

    if (jovo.constructor.name !== 'GoogleAction') {
      return;
    }

    super.setGoogleAnalyticsObject(handleRequest);
  }
}
