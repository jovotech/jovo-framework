import { IsDateString } from '@jovotech/output';

export class ActionMetadata {
  @IsDateString()
  expireTime: string;
}
