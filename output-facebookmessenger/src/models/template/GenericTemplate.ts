import {
  ArrayMaxSize,
  Card,
  Carousel,
  Equals,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import {
  GENERIC_TEMPLATE_BUTTONS_MAX_SIZE,
  GENERIC_TEMPLATE_ELEMENT_TEXT_MAX_LENGTH,
  GENERIC_TEMPLATE_MAX_SIZE,
} from '../../constants';
import { TransformButton } from '../../decorators/transformation/TransformButton';
import { Button, ButtonType } from '../button/Button';
import { WebViewHeightRatio } from '../button/UrlButton';
import { TemplateBase, TemplateType } from './Template';

export enum ImageAspectRatio {
  Horizontal = 'horizontal',
  Square = 'square',
}

export class GenericTemplateDefaultAction {
  @Equals(ButtonType.Url)
  type: ButtonType.Url | 'web_url';

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

export class GenericTemplateElement {
  @IsString()
  @IsNotEmpty()
  @MaxLength(GENERIC_TEMPLATE_ELEMENT_TEXT_MAX_LENGTH)
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(GENERIC_TEMPLATE_ELEMENT_TEXT_MAX_LENGTH)
  subtitle?: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GenericTemplateDefaultAction)
  default_action?: GenericTemplateDefaultAction;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(GENERIC_TEMPLATE_BUTTONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @TransformButton()
  buttons?: Button[];

  toCard?(): Card {
    const card: Card = {
      title: this.title,
    };
    if (this.subtitle) {
      card.subtitle = this.subtitle;
    }
    if (this.image_url) {
      card.imageUrl = this.image_url;
    }
    return card;
  }
}

export class GenericTemplate extends TemplateBase<TemplateType.Generic | 'generic'> {
  @Equals(TemplateType.Generic)
  template_type: TemplateType.Generic | 'generic';

  @IsOptional()
  @IsEnum(ImageAspectRatio)
  image_aspect_ratio?: ImageAspectRatio;

  @IsArray()
  @ArrayMaxSize(GENERIC_TEMPLATE_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => GenericTemplateElement)
  elements: GenericTemplateElement[];

  toCarousel?(): Carousel {
    return {
      items: this.elements.map((element) => element.toCard!()),
    };
  }
}
