import { registerOutputPlatform } from '@jovotech/output';
import {
  AplHeader,
  AplRenderDocumentDirective,
  Card as AlexaCard,
  CardType,
  NormalizedAlexaOutputTemplate,
  OutputSpeech,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    header?: AplHeader;
    backgroundImageUrl?: string;

    toAlexaCard?(): AlexaCard<CardType.Standard>;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    toApl?(cardTemplate?: any): AplRenderDocumentDirective;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    header?: AplHeader;
    backgroundImageUrl?: string;

    toApl?(carouselTemplate?: any): AplRenderDocumentDirective;
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
export * from './templates';
export * from './constants';
export * from './AlexaOutputTemplateConverterStrategy';

export { validateAlexaString, convertMessageToOutputSpeech } from './utilities';
