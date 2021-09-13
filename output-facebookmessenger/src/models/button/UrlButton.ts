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

export class UrlButton extends ButtonBase<ButtonType.Url | 'web_url'> {
  @Equals(ButtonType.Url)
  type: ButtonType.Url;

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
