import { JovoRequest, JovoResponse } from '../Interfaces';
import { RequestBuilder, ResponseBuilder, TestSuite } from '../TestSuite';
import { ActionSet } from './ActionSet';
import { Extensible, ExtensibleConfig } from './Extensible';

export abstract class Platform<
  REQ extends JovoRequest = JovoRequest,
  RES extends JovoResponse = JovoResponse
> extends Extensible {
  requestBuilder?: RequestBuilder<REQ>;
  responseBuilder?: ResponseBuilder<RES>;

  constructor(config?: ExtensibleConfig) {
    super(config);
    this.actionSet = new ActionSet(
      [
        'setup',
        '$init',
        '$request',
        '$session',
        '$user',
        '$type',
        '$nlu',
        '$inputs',
        '$output',
        '$response',
      ],
      this,
    );
  }

  abstract makeTestSuite(): TestSuite<RequestBuilder<REQ>, ResponseBuilder<RES>>;

  abstract getAppType(): string;

  supportsASR(): boolean {
    return this.actionSet.middleware.has('$asr');
  }

  supportsTTS(): boolean {
    return this.actionSet.middleware.has('$tts');
  }
}
