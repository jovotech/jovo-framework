import {
  AudioData,
  BaseApp,
  HandleRequest,
  Host,
  Jovo,
  SpeechBuilder,
  SessionConstants,
  JovoError,
  ErrorCode,
  AxiosResponse,
} from 'jovo-core';
import { Lindenbaum } from '../Lindenbaum';
import { LindenbaumRequest } from './LindenbaumRequest';
import { LindenbaumResponse, Responses } from './LindenbaumResponse';
import { LindenbaumUser } from './LindenbaumUser';
import { LindenbaumSpeechBuilder } from './LindenbaumSpeechBuilder';
import { DialogAPI, DialogAPIRequestOptions, DialogAPIData } from '../services/DialogAPI';

export class LindenbaumBot extends Jovo {
  $lindenbaumBot: LindenbaumBot;
  $user: LindenbaumUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$lindenbaumBot = this;
    this.$response = new LindenbaumResponse();
    this.$speech = new LindenbaumSpeechBuilder(this);
    // $reprompt object has to be added even if the platform doesn't use it.
    // Is used by users as platform independent feature
    this.$reprompt = new LindenbaumSpeechBuilder(this);
    this.$user = new LindenbaumUser(this);
    this.$output.Lindenbaum = [];
  }

  setResponses(responses: Responses[]): this {
    const response = this.$response as LindenbaumResponse;
    response.responses = responses;

    return this;
  }

  /**
   * Calls the `/call/drop` endpoint to terminate the call
   */
  addDrop(): this {
    this.$output.Lindenbaum.push({
      '/call/drop': {
        dialogId: this.$request!.getSessionId(),
      },
    });

    return this;
  }

  /**
   * Calls the `/call/bridge` endpoint to bridge the call to `headNumber`
   * @param {number} extensionLength
   * @param {string} headNumber
   */
  addBridge(extensionLength: number, headNumber: string): this {
    this.$output.Lindenbaum.push({
      '/call/bridge': {
        dialogId: this.$request!.getSessionId(),
        extensionLength,
        headNumber,
      },
    });

    return this;
  }

  /**
   * Calls the `/call/forward` endpoint to forward the call to `destinationNumber`
   * @param {string} destinationNumber
   */
  addForward(destinationNumber: string): this {
    this.$output.Lindenbaum.push({
      '/call/forward': {
        dialogId: this.$request!.getSessionId(),
        destinationNumber,
      },
    });

    return this;
  }

  /**
   * Calls the `/call/data` endpoint to save additional data on the conversations
   * @param {string} key
   * @param {string} value
   */
  addData(key: string, value: string): this {
    this.$output.Lindenbaum.push({
      '/call/data': {
        dialogId: this.$request!.getSessionId(),
        key,
        value,
      },
    });

    return this;
  }

  isNewSession(): boolean {
    if (this.$user.$session) {
      return this.$user.$session.id !== this.$request!.getSessionId();
    } else {
      return false;
    }
  }

  hasAudioInterface(): boolean {
    return this.$request!.hasAudioInterface();
  }

  hasScreenInterface(): boolean {
    return this.$request!.hasScreenInterface();
  }

  hasVideoInterface(): boolean {
    return this.$request!.hasVideoInterface();
  }

  getSpeechBuilder(): SpeechBuilder | undefined {
    return new LindenbaumSpeechBuilder(this);
  }

  speechBuilder(): SpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  getDeviceId(): undefined {
    return undefined;
  }

  getRawText(): string {
    const request = this.$request as LindenbaumRequest;
    return request.getRawText();
  }

  getTimestamp(): string {
    return this.$request!.getTimestamp();
  }

  getLocale(): string {
    return this.$request!.getLocale();
  }

  getType(): string {
    return Lindenbaum.appType;
  }

  getPlatformType(): string {
    return Lindenbaum.type;
  }

  getSelectedElementId(): undefined {
    return undefined;
  }

  getAudioData(): AudioData | undefined {
    return undefined;
  }

  /**
   * Returns the dialog data for the parsed `dialogId`.
   * If `dialogId` is not parsed, it uses the current request's `dialogId` property
   * @param {string} resellerToken
   * @param {string | undefined} dialogId
   * @returns {Promise<AxiosResponse<DialogAPIData>>}
   */
  async getDialogData(
    resellerToken: string,
    dialogId?: string,
  ): Promise<AxiosResponse<DialogAPIData>> {
    const request = this.$request as LindenbaumRequest;
    const options: DialogAPIRequestOptions = {
      resellerToken,
      dialogId: dialogId || request.dialogId,
    };

    return DialogAPI.getDialogData(options);
  }

  /**
   * Delete the dialog data for the parsed `dialogId`.
   * If `dialogId` is not parsed, it uses the current request's `dialogId` property
   * @param {string} resellerToken
   * @param {string | undefined} dialogId
   * @returns {Promise<AxiosResponse>}
   */
  async deleteDialogData(resellerToken: string, dialogId?: string): Promise<AxiosResponse> {
    const request = this.$request as LindenbaumRequest;
    const options: DialogAPIRequestOptions = {
      resellerToken,
      dialogId: dialogId || request.dialogId,
    };

    return DialogAPI.deleteDialogData(options);
  }
}
