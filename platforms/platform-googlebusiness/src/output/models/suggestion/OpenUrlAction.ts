import { IsUrl } from '@jovotech/output';

export class OpenUrlAction {
  @IsUrl()
  url!: string;
}
