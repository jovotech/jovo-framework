import {
  Equals,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from '@jovotech/output';
import { BUTTON_TITLE_MAX_LENGTH } from '../../constants';
import { ButtonBase, ButtonType } from './Button';

export enum WebViewHeightRatio {
  Compact = 'COMPACT',
  Tall = 'TALL',
  Full = 'FULL',
}

export class LinkButton extends ButtonBase<ButtonType.Link | 'web_url'> {
  @Equals(ButtonType.Link)
  type: ButtonType.Link;

  @IsString()
  @IsNotEmpty()
  @MaxLength(BUTTON_TITLE_MAX_LENGTH)
  title: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsEnum(WebViewHeightRatio)
  webview_height_ratio?: WebViewHeightRatio;

  @IsOptional()
  @IsBoolean()
  messenger_extensions?: boolean;

  @IsOptional()
  @IsUrl()
  fallback_url?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  webview_share_button?: string | 'hide';
}
