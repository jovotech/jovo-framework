import { registerOutputPlatform } from '@jovotech/output';
import { NormalizedCoreOutputTemplate } from './models';

// Make NormalizedCoreOutputTemplate available for the OutputTemplatePlatforms-object via the core-key.
declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    core?: NormalizedCoreOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('core', NormalizedCoreOutputTemplate);

export * from './models';
export * from './CoreOutputTemplateConverterStrategy';
