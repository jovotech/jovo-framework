import {
  ArrayMinSize,
  Card,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { AplHeader } from './AplHeader';
import { AplRenderDocumentDirective } from './AplRenderDocumentDirective';

export class AplList {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  backgroundImageUrl?: string;

  @IsOptional()
  header?: AplHeader;

  @IsArray()
  @ArrayMinSize(2)
  @IsInstance(Card, {
    each: true,
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => Card)
  items: Card[];

  toApl?(): AplRenderDocumentDirective;
}
