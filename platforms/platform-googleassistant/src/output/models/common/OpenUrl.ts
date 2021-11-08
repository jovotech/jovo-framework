import { EnumLike } from '@jovotech/framework';
import { IsEnum, IsUrl } from '@jovotech/output';

export enum UrlHint {
  Unspecified = 'LINK_UNSPECIFIED',
  Amp = 'AMP',
}

export type UrlHintLike = EnumLike<UrlHint>;

export class OpenUrl {
  @IsUrl({ protocols: ['https', 'http'] })
  url!: string;

  @IsEnum(UrlHint)
  hint!: UrlHintLike;
}
