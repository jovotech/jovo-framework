import { registerOutputPlatform } from '@jovotech/output';
import { CoreOutputTemplate } from './models';

// Make CoreOutputTemplate available for the OutputTemplatePlatforms-object via the Core-key.
declare module '@jovotech/output/dist/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    Core?: CoreOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('Core', CoreOutputTemplate);

export * from './models';
export * from './CoreOutputTemplateConverterStrategy';
