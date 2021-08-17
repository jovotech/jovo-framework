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
import { Button, ButtonType } from './Button';

export enum WebViewHeightRatio {
  Compact = 'COMPACT',
  Tall = 'TALL',
  Full = 'FULL',
}

export interface LinkButtonOptions {
  webview_height_ratio?: WebViewHeightRatio;
  messenger_extensions?: boolean;
  fallback_url?: string;
  webview_share_button?: string;
}

export class LinkButton extends Button<ButtonType.Link> {
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
