import { AnyObject } from '@jovotech/framework';
import { Equals, IsObject, IsOptional, TransformMap, ValidateNested } from '@jovotech/output';
import { AplDataSource } from './AplDataSource';
import { AplDirective } from './AplDirective';

export class AplaRenderDocumentDirective extends AplDirective<'Alexa.Presentation.APLA.RenderDocument'> {
  @Equals('Alexa.Presentation.APLA.RenderDocument')
  type!: 'Alexa.Presentation.APLA.RenderDocument';

  @IsObject()
  document!: AnyObject & { type: 'APLA' | string };

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => AplDataSource)
  datasources?: Record<string, AplDataSource>;
}
