import { IsBoolean, IsDefined, IsUrl } from '@jovotech/output';

export type Value = null | number | string | boolean | Record<string, unknown> | unknown[];

export class HtmlResponse {
  @IsDefined()
  updateState: Value;

  @IsBoolean()
  suppressMic: boolean;

  @IsUrl()
  url: string;
}
