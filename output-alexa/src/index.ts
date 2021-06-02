import { registerOutputPlatform } from '@jovotech/output';
import {
  AlexaOutputTemplate,
  AplRenderDocumentDirective,
  Card as AlexaCard,
  CardType,
  OutputSpeech,
  OutputSpeechType,
} from './models';
import { AplHeader } from './models/apl/AplHeader';
import { AplList } from './models/apl/AplList';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/Card' {
  interface Card {
    header?: AplHeader;
    backgroundImageUrl?: string;

    toAlexaCard?(): AlexaCard<CardType.Standard>;
    toApl?(): AplRenderDocumentDirective;
  }
}

declare module '@jovotech/output/dist/models/Carousel' {
  interface Carousel {
    header?: AplHeader;
    backgroundImageUrl?: string;

    toApl?(): AplRenderDocumentDirective;
  }
}

declare module '@jovotech/output/dist/models/OutputTemplateBase' {
  interface OutputTemplateBase {
    list?: AplList;
  }
}

declare module '@jovotech/output/dist/models/Message' {
  interface Message {
    toAlexaOutputSpeech?(): OutputSpeech<OutputSpeechType.Ssml>;
  }
}

// augment the prototypes of the generic models to have methods to convert to the Alexa-variant
augmentModelPrototypes();

// Make AlexaOutputTemplate available for the OutputTemplatePlatforms-object via the Alexa-key.
declare module '@jovotech/output/dist/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    Alexa?: AlexaOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('Alexa', AlexaOutputTemplate);

export * from './decorators/validation/IsValidCardImage';
export * from './decorators/validation/IsValidCardImageUrl';
export * from './decorators/validation/IsValidCardString';
export * from './decorators/validation/IsValidAlexaString';
export * from './decorators/validation/IsValidOutputSpeechString';

export * from './models';

export * from './AlexaOutputTemplateConverterStrategy';

export { validateAlexaString } from './utilities';
