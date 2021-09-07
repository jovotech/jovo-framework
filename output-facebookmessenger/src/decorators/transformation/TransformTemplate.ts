import { Type } from '@jovotech/output';
import { ButtonTemplate, GenericTemplate, MediaTemplate, ReceiptTemplate } from '../../models';
// import should not be shortened or decorator has problems with finding the correct enum
import { TemplateBase, TemplateType } from '../../models/template/Template';

export function TransformTemplate(): PropertyDecorator {
  return Type(() => TemplateBase, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'template_type',
      subTypes: [
        { value: ButtonTemplate, name: TemplateType.Button },
        { value: GenericTemplate, name: TemplateType.Generic },
        { value: MediaTemplate, name: TemplateType.Media },
        { value: ReceiptTemplate, name: TemplateType.Receipt },
      ],
    },
  }) as PropertyDecorator;
}
