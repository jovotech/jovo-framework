import { IsEnum, IsUrl } from '@jovotech/output';

export enum UrlHint {
  Unspecified = 'LINK_UNSPECIFIED',
  Amp = 'AMP',
}

export class OpenUrl {
  @IsUrl({ protocols: ['https', 'http'] })
  url: string;

  @IsEnum(UrlHint)
  hint: UrlHint;
}
