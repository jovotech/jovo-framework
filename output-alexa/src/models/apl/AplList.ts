import {
  ArrayMinSize,
  Card,
  IsArray,
  IsInstance,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import AplListJson from '../../apl/List.json';
import { AplHeader } from './AplHeader';
import { AplRenderDocumentDirective } from './AplRenderDocumentDirective';

export class AplList {
  @IsOptional()
  @IsString()
  backgroundImageUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AplHeader)
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

  toApl?(): AplRenderDocumentDirective {
    if (this.header) {
      AplListJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      AplListJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    (AplListJson.datasources.data.items as Card[]) = this.items;

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplListJson,
    };
  }
}
