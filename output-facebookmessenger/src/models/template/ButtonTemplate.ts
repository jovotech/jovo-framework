import {
  ArrayMaxSize,
  ArrayMinSize,
  Equals,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from '@jovotech/output';
import {
  BUTTON_TEMPLATE_BUTTONS_MAX_SIZE,
  BUTTON_TEMPLATE_BUTTONS_MIN_SIZE,
  BUTTON_TEMPLATE_TEXT_MAX_LENGTH,
} from '../../constants';
import { TransformButton } from '../../decorators/transformation/TransformButton';
import { Button } from '../button/Button';
import { Template, TemplateType } from './Template';

export class ButtonTemplate extends Template<TemplateType.Button> {
  @Equals(TemplateType.Button)
  template_type: TemplateType.Button;

  @IsString()
  @IsNotEmpty()
  @MaxLength(BUTTON_TEMPLATE_TEXT_MAX_LENGTH)
  text: string;

  @IsArray()
  @ArrayMinSize(BUTTON_TEMPLATE_BUTTONS_MIN_SIZE)
  @ArrayMaxSize(BUTTON_TEMPLATE_BUTTONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @TransformButton()
  buttons: Button[];
}
