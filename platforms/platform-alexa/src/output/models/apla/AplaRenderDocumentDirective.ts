import { AnyObject } from '@jovotech/framework';
import { Equals, IsObject, IsOptional, TransformMap, ValidateNested } from '@jovotech/output';
import { AplDirective } from '../apl/AplDirective';
import { AplaDataSource } from './AplaDataSource';

export class AplaRenderDocumentDirective extends AplDirective<'Alexa.Presentation.APLA.RenderDocument'> {
  @Equals('Alexa.Presentation.APLA.RenderDocument')
  type!: 'Alexa.Presentation.APLA.RenderDocument';

  @IsObject()
  document!: (AnyObject & { type: 'APLA' | string }) | { type: 'Link'; src: string };

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => AplaDataSource)
  datasources?: Record<string, AplaDataSource>;
}
