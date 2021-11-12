import { AnyObject } from '@jovotech/framework';
import { Equals, IsObject, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { Directive } from '../Directive';
import { HtmlConfiguration } from './HtmlConfiguration';
import { HtmlRequest } from './HtmlRequest';
import { HtmlTransformers } from './HtmlTransformers';

export class HtmlStartDirective extends Directive<'Alexa.Presentation.HTML.Start'> {
  @Equals('Alexa.Presentation.HTML.Start')
  type!: 'Alexa.Presentation.HTML.Start';

  @IsOptional()
  @IsObject()
  data?: AnyObject;

  @ValidateNested()
  @Type(() => HtmlRequest)
  request!: HtmlRequest;

  @ValidateNested()
  @Type(() => HtmlConfiguration)
  configuration!: HtmlConfiguration;

  @IsOptional()
  @ValidateNested()
  @Type(() => HtmlTransformers)
  transformer?: HtmlTransformers;
}
