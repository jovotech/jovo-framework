import { IsNotEmpty, IsString } from '@jovotech/output';

export class TelephonyPlayAudio {
  @IsString()
  @IsNotEmpty()
  audio_uri!: string;
}
