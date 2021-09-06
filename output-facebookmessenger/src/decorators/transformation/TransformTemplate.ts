import { Type } from '@jovotech/output';
import {
  ButtonTemplate,
  GenericTemplate,
  MediaTemplate,
  ReceiptTemplate,
  TemplateBase,
  TemplateType,
} from '../../models';

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
