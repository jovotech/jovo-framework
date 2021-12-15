import { Alexa } from './Alexa';
import {
  getProductList,
  InSkillProduct,
  InSkillProductsParams,
  ProductListResponse,
} from './api/IspApi';
import { PlayerActivity, PurchaseResult, PurchaseResultLike } from './interfaces';

export class AlexaAudioPlayer {
  constructor(private alexa: Alexa) {}

  get offsetInMilliseconds(): number | undefined {
    return this.alexa.$request.context?.AudioPlayer?.offsetInMilliseconds;
  }

  get playerActivity(): PlayerActivity | undefined {
    return this.alexa.$request.context?.AudioPlayer?.playerActivity;
  }

  get token(): string | undefined {
    return this.alexa.$request.context?.AudioPlayer?.token;
  }

  toJSON(): AlexaAudioPlayer {
    return { ...this, alexa: undefined };
  }
}
