import { registerOutputPlatform } from '@jovotech/output';
import { CoreOutputTemplate } from './models';

// Make CoreOutputTemplate available for the OutputTemplatePlatforms-object via the CorePlatform-key.
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    CorePlatform?: CoreOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('CorePlatform', CoreOutputTemplate);

export * from './models';
export * from './CoreOutputTemplateConverterStrategy';
