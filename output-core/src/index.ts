import { registerOutputPlatform } from '@jovotech/output';
import { CoreOutputTemplate } from './models';

// Make CoreOutputTemplate available for the OutputTemplatePlatforms-object via the core-key.
declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    core?: CoreOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('core', CoreOutputTemplate);

export * from './models';
export * from './CoreOutputTemplateConverterStrategy';
