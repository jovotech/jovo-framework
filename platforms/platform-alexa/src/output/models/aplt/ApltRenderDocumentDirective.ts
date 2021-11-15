import { Equals, IsObject, IsOptional, TransformMap, Type, ValidateNested } from '@jovotech/output';
import { AplDataSource } from '../apl/AplDataSource';
import { AplDirective } from '../apl/AplDirective';
import { ApltDocument } from './ApltDocument';

export class ApltRenderDocumentDirective extends AplDirective<'Alexa.Presentation.APLT.RenderDocument'> {
  @Equals('Alexa.Presentation.APLT.RenderDocument')
  type!: 'Alexa.Presentation.APLT.RenderDocument';

  @IsOptional()
  @Equals('FOUR_CHARACTER_CLOCK')
  targetProfile?: 'FOUR_CHARACTER_CLOCK';

  @ValidateNested()
  @Type(() => ApltDocument)
  document!: ApltDocument;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => AplDataSource)
  datasources?: Record<string, AplDataSource>;
}
