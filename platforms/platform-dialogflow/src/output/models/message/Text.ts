import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MessageValue,
} from '@jovotech/output';
import { TEXT_MAX_LENGTH } from '../../constants';

export class Text {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(TEXT_MAX_LENGTH)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  text?: string[];

  toMessage?(): MessageValue {
    return this.text?.[0] || '';
  }
}
