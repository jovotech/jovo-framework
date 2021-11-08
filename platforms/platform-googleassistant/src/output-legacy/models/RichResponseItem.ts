import { IsNotEmpty, IsOptional, IsString, Type } from '@jovotech/output';
import { IsValidRichResponseItemObject } from '../decorators/validation/IsValidRichResponseItemObject';
import { BasicCard } from './basic-card/BasicCard';
import { CarouselBrowse } from './carousel-browse/CarouselBrowse';
import { HtmlResponse } from './html-response/HtmlResponse';
import { MediaResponse } from './media-response/MediaResponse';
import { SimpleResponse } from './simple-response/SimpleResponse';
import { StructuredResponse } from './structured-response/StructuredResponse';
import { TableCard } from './table-card/TableCard';

export class RichResponseItem {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsValidRichResponseItemObject()
  @Type(() => SimpleResponse)
  simpleResponse?: SimpleResponse;

  @IsValidRichResponseItemObject()
  @Type(() => BasicCard)
  basicCard?: BasicCard;

  @IsValidRichResponseItemObject()
  @Type(() => StructuredResponse)
  structuredResponse?: StructuredResponse;

  @IsValidRichResponseItemObject()
  @Type(() => MediaResponse)
  mediaResponse?: MediaResponse;

  @IsValidRichResponseItemObject()
  @Type(() => CarouselBrowse)
  carouselBrowse?: CarouselBrowse;

  @IsValidRichResponseItemObject()
  @Type(() => TableCard)
  tableCard?: TableCard;

  @IsValidRichResponseItemObject()
  @Type(() => HtmlResponse)
  htmlResponse?: HtmlResponse;
}
