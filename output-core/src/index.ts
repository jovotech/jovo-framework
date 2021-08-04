import { registerOutputPlatform } from '@jovotech/output';
import { CorePlatformOutputTemplate } from './models';

// Make CorePlatformOutputTemplate available for the OutputTemplatePlatforms-object via the CorePlatform-key.
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    CorePlatform?: CorePlatformOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('CorePlatform', CorePlatformOutputTemplate);

export * from './models';
export * from './CoreOutputTemplateConverterStrategy';
