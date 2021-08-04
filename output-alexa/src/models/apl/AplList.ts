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
import { APL_LIST_MIN_SIZE } from '../../constants';
import { AplHeader } from './AplHeader';
import { AplRenderDocumentDirective } from './AplRenderDocumentDirective';

export class AplList {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  backgroundImageUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AplHeader)
  header?: AplHeader;

  @IsArray()
  @ArrayMinSize(APL_LIST_MIN_SIZE)
  @ValidateNested({
    each: true,
  })
  @Type(() => Card)
  items: Card[];

  toApl?(): AplRenderDocumentDirective {
    if (this.title) {
      AplListJson.datasources.data.title = this.title;
    }

    if (this.header) {
      AplListJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      AplListJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    (AplListJson.datasources.data.items as Card[]) = this.items.map((item: Card) => ({
      ...item,
      selection: item.selection
        ? {
            type: 'Selection',
            ...item.selection,
          }
        : undefined,
    }));

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplListJson,
    };
  }
}
