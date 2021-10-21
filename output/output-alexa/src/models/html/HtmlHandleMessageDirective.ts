import { Equals, IsObject, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { Directive } from '../Directive';
import { HtmlTransformers } from './HtmlTransformers';

export class HtmlHandleMessageDirective extends Directive<'Alexa.Presentation.HTML.HandleMessage'> {
  @Equals('Alexa.Presentation.HTML.HandleMessage')
  type: 'Alexa.Presentation.HTML.HandleMessage';

  @IsOptional()
  @IsObject()
  message?: Record<string, any>;

  @IsOptional()
  @ValidateNested()
  @Type(() => HtmlTransformers)
  transformer?: HtmlTransformers;
}
