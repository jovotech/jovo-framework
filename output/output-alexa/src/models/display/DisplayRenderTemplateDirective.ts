import { Equals, Type, ValidateNested } from '@jovotech/output';
import { Directive } from '../Directive';
import { DisplayTemplate, DisplayTemplateType } from './DisplayTemplate';
import { BodyTemplate1 } from './templates/BodyTemplate1';
import { BodyTemplate2 } from './templates/BodyTemplate2';
import { BodyTemplate3 } from './templates/BodyTemplate3';
import { BodyTemplate6 } from './templates/BodyTemplate6';
import { BodyTemplate7 } from './templates/BodyTemplate7';
import { ListTemplate1 } from './templates/ListTemplate1';
import { ListTemplate2 } from './templates/ListTemplate2';

export class DisplayRenderTemplateDirective extends Directive<'Display.RenderTemplate'> {
  @Equals('Display.RenderTemplate')
  type: 'Display.RenderTemplate';

  @ValidateNested()
  @Type(() => DisplayTemplate, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: BodyTemplate1, name: DisplayTemplateType.Body1 },
        { value: BodyTemplate2, name: DisplayTemplateType.Body2 },
        { value: BodyTemplate3, name: DisplayTemplateType.Body3 },
        { value: BodyTemplate6, name: DisplayTemplateType.Body6 },
        { value: BodyTemplate7, name: DisplayTemplateType.Body7 },
        { value: ListTemplate1, name: DisplayTemplateType.List1 },
        { value: ListTemplate2, name: DisplayTemplateType.List2 },
      ],
    },
  })
  template: DisplayTemplate;
}
