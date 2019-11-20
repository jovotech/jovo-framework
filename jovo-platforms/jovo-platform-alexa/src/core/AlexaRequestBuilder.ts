import { AlexaRequest } from './AlexaRequest';
import { RequestBuilder } from 'jovo-core';
import * as path from 'path';
const samples: { [key: string]: string } = {
  'LaunchRequest': 'LaunchRequest.json',
  'IntentRequest1': 'IntentRequest1.json',
  'IntentRequestWithSlot': 'IntentRequestWithSlot.json',
  'IntentRequestWithSlotResolution': 'IntentRequestWithSlotResolution.json',
  'IntentRequestWithSlotResolutionNoMatch': 'IntentRequestWithSlotResolutionNoMatch.json',
  'Connections.Response': 'Connections.Response.json',
  'AudioPlayer.PlaybackStarted': 'AudioPlayer.PlaybackStarted.json',
  'SessionEndedRequest': 'SessionEndedRequest.json',
  'System.ExceptionEncountered': 'System.ExceptionEncountered.json',
  'PlaybackController.PlayCommandIssued': 'PlaybackController.PlayCommandIssued.json',
  'AlexaSkillEvent.SkillDisabled': 'AlexaSkillEvent.SkillDisabled.json',
  'DialogDelegateRequest': 'DialogDelegateRequest.json',
  'Display.ElementSelected': 'Display.ElementSelected.json',
};

export class AlexaRequestBuilder implements RequestBuilder<AlexaRequest> {
  type = 'AlexaSkill';

  async launch(json?: object): Promise<AlexaRequest> {
    // tslint:disable-line
    return await this.launchRequest(json);
  }
  async intent(json?: object): Promise<AlexaRequest>; // tslint:disable-line
  async intent(name?: string, inputs?: any): Promise<AlexaRequest>; // tslint:disable-line
  // tslint:disable-next-line
  async intent(obj?: any, inputs?: any): Promise<AlexaRequest> {
    if (typeof obj === 'string') {
      const req = await this.intentRequest();
      req.setIntentName(obj);
      if (inputs) {
        for (const slot in inputs) {
          if (inputs.hasOwnProperty(slot)) {
            req.setSlot(slot, inputs[slot]);
          }
        }
      }
      return req;
    } else {
      return await this.intentRequest(obj);
    }
  }

  async launchRequest(json?: object): Promise<AlexaRequest> {
    //tslint:disable-line
    if (json) {
      return AlexaRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
      const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
      return AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
    }
  }
  async intentRequest(json?: object): Promise<AlexaRequest> {
    // tslint:disable-line
    if (json) {
      return AlexaRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest1')));
      return AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
    }
  }

  async rawRequest(json: object) {
    // tslint:disable-line
    return AlexaRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string) {
    const request = JSON.stringify(require(getJsonFilePath(key)));
    return AlexaRequest.fromJSON(JSON.parse(request));
  }
  async audioPlayerRequest(json?: object) {
    // tslint:disable-line
    if (json) {
      return AlexaRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
      return AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
    }
  }
  /**
   * End
   * @param {object|string} json
   * @return {SessionEndedRequest}
   */
  // tslint:disable-next-line
  async end(json?: any) {
    if (json) {
      return AlexaRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('SessionEndedRequest')));
      return AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
    }
  }
}

function getJsonFilePath(key: string, version = 'v1'): string {
  let folder = './../../../';

  if (process.env.NODE_ENV === 'UNIT_TEST') {
    folder = './../../';
  }

  const fileName = samples[key];

  if (!fileName) {
    throw new Error(`Can't find file.`);
  }

  return path.join(folder, 'sample-request-json', version, fileName);
}
