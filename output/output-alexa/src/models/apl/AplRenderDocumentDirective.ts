import { Equals, IsObject, IsOptional, TransformMap, ValidateNested } from '@jovotech/output';
import { AplDataSource } from './AplDataSource';
import { AplDirective } from './AplDirective';

export class AplRenderDocumentDirective extends AplDirective<'Alexa.Presentation.APL.RenderDocument'> {
  @Equals('Alexa.Presentation.APL.RenderDocument')
  type: 'Alexa.Presentation.APL.RenderDocument';

  @IsObject()
  document: { [key: string]: any; type: 'APL' | string } | { type: 'Link'; src: string };

  @IsOptional()
  @IsObject()
  sources?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => AplDataSource)
  datasources?: Record<string, AplDataSource>;
}
