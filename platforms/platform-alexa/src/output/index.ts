import { registerOutputPlatform } from '@jovotech/output';
import {
  NormalizedAlexaOutputTemplate,
  AplHeader,
  AplRenderDocumentDirective,
  Card as AlexaCard,
  CardType,
  OutputSpeech,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    header?: AplHeader;
    backgroundImageUrl?: string;

    toAlexaCard?(): AlexaCard<CardType.Standard>;
    toApl?(): AplRenderDocumentDirective;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    header?: AplHeader;
    backgroundImageUrl?: string;

    toApl?(): AplRenderDocumentDirective;
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toAlexaOutputSpeech?(): OutputSpeech;
  }
}

// augment the prototypes of the generic models to have methods to convert to the Alexa-variant
augmentModelPrototypes();

// Make NormalizedAlexaOutputTemplate available for the NormalizedOutputTemplatePlatforms-object via the alexa-key.
declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    alexa?: NormalizedAlexaOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('alexa', NormalizedAlexaOutputTemplate);

export * from './decorators/validation/IsValidCardImage';
export * from './decorators/validation/IsValidCardImageUrl';
export * from './decorators/validation/IsValidCardString';
export * from './decorators/validation/IsValidAlexaString';
export * from './decorators/validation/IsValidOutputSpeechString';

export * from './models';

export * from './templates/AskForPermissionConsentCardOutput';
export * from './templates/AskForPermissionOutput';
export * from './templates/AskForRemindersPermissionOutput';
export * from './templates/AskForTimersPermissionOutput';
export * from './templates/IspBuyOutput';
export * from './templates/IspCancelOutput';
export * from './templates/IspUpsellOutput';

export * from './constants';

export * from './AlexaOutputTemplateConverterStrategy';

export { validateAlexaString, convertMessageToOutputSpeech } from './utilities';
