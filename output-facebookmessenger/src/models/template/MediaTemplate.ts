import {
  ArrayMaxSize,
  ArrayMinSize,
  Equals,
  IsArray,
  IsBoolean,
  IsEitherValid,
  IsEnum,
  IsOptional,
  isString,
  isURL,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { MEDIA_TEMPLATE_BUTTONS_MAX_SIZE, MEDIA_TEMPLATE_ELEMENTS_SIZE } from '../../constants';
import { TransformButton } from '../../decorators/transformation/TransformButton';
import { Button } from '../button/Button';
import { Template, TemplateType } from './Template';

export enum MediaTemplateElementType {
  Image = 'image',
  Video = 'video',
}

export class MediaTemplateElement {
  @IsEnum(MediaTemplateElementType)
  media_type: MediaTemplateElementType;

  @IsEitherValid<MediaTemplateElement>({
    keys: ['attachment_id', 'url'],
    validate: (value, args) => {
      if (!isString(value)) {
        return '$property must be a string';
      }
      if (!value) {
        return '$property should not be empty';
      }
    },
  })
  attachment_id?: string;

  @IsEitherValid<MediaTemplateElement>({
    keys: ['attachment_id', 'url'],
    validate: (value, args) => {
      if (!isURL(value)) {
        return '$property must be an URL address';
      }
    },
  })
  url?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MEDIA_TEMPLATE_BUTTONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @TransformButton()
  buttons?: Button[];
}

export class MediaTemplate extends Template<TemplateType.Media> {
  @Equals(TemplateType.Media)
  template_type: TemplateType.Media;

  @IsOptional()
  @IsBoolean()
  sharable: boolean;

  @IsArray()
  @ArrayMinSize(MEDIA_TEMPLATE_ELEMENTS_SIZE)
  @ArrayMaxSize(MEDIA_TEMPLATE_ELEMENTS_SIZE)
  @ValidateNested({ each: true })
  @Type(() => MediaTemplateElement)
  elements: [MediaTemplateElement];
}
