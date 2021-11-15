import { AnyObject } from '@jovotech/framework';
import { Equals, IsObject, IsOptional, TransformMap, ValidateNested } from '@jovotech/output';
import { AplDataSource } from './AplDataSource';
import { AplDirective } from './AplDirective';

export class AplRenderDocumentDirective extends AplDirective<'Alexa.Presentation.APL.RenderDocument'> {
  @Equals('Alexa.Presentation.APL.RenderDocument')
  type!: 'Alexa.Presentation.APL.RenderDocument';

  @IsObject()
  document!: (AnyObject & { type: 'APL' | string }) | { type: 'Link'; src: string };

  @IsOptional()
  @IsObject()
  sources?: AnyObject;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => AplDataSource)
  datasources?: Record<string, AplDataSource>;
}
