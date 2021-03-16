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
import { TransformButton } from '../../decorators/transformation/TransformButton';
import { Button } from '../button/Button';
import { Template, TemplateType } from './Template';

export class ButtonTemplate extends Template<TemplateType.Button> {
  @Equals(TemplateType.Button)
  template_type: TemplateType.Button;

  @IsString()
  @IsNotEmpty()
  @MaxLength(640)
  text: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @TransformButton()
  buttons: Button[];
}
