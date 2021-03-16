import { IsValidTelephonySynthesizeSpeechString } from '../../../decorators/validation/IsValidTelephonySynthesizeSpeechString';

export class TelephonySynthesizeSpeech {
  @IsValidTelephonySynthesizeSpeechString()
  text?: string;

  @IsValidTelephonySynthesizeSpeechString()
  ssml?: string;
}
