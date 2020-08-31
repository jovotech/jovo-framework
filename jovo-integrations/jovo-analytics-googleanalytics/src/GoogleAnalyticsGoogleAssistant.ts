import { GoogleAnalytics } from './GoogleAnalytics';
import { GoogleActionRequest } from 'jovo-platform-googleassistant';
import { DialogflowRequest } from 'jovo-platform-dialogflow';
import { HandleRequest, Jovo, JovoError, ErrorCode } from 'jovo-core';
import { get } from 'lodash';

export class GoogleAnalyticsGoogleAssistant extends GoogleAnalytics {
  track(handleRequest: HandleRequest) {
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

    const dialogFlowRequest = jovo.$request as DialogflowRequest;

    const userName: string | undefined = get(
      dialogFlowRequest.originalDetectIntentRequest!.payload,
      'user.profile.familyName',
    );
    const isCrawler = userName && userName === 'Crawler';
    if (isCrawler) {
      return;
    }

    if (!this.config.skipUnverifiedUser) {
      const userVerificationStatus: string | undefined = get(
        dialogFlowRequest.originalDetectIntentRequest!.payload,
        'user.userVerificationStatus',
      ); //  inputs[0].rawInputs[0].inputType');
      const isVoiceMatchUser = userVerificationStatus && userVerificationStatus === 'VERIFIED';
      if (!isVoiceMatchUser) {
        return;
      }
    }
    super.track(handleRequest);
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

    super.setGoogleAnalyticsObject(handleRequest);
  }
}
