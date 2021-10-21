import { registerOutputPlatform } from '@jovotech/output';
import {
  BasicCard,
  Carousel as GoogleAssistantCarousel,
  NormalizedGoogleAssistantOutputTemplate,
  SimpleResponse,
  Suggestion,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    toGoogleAssistantBasicCard?(): BasicCard;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    toGoogleAssistantCarousel?(): GoogleAssistantCarousel;
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toGoogleAssistantSimpleResponse?(): SimpleResponse;
  }
}

declare module '@jovotech/output/dist/types/models/QuickReply' {
  interface QuickReply {
    toGoogleAssistantSuggestion?(): Suggestion;
  }
}

// augment the prototypes of the generic models to have methods to convert to the GoogleAssistant-variant
augmentModelPrototypes();

// Make NormalizedGoogleAssistantOutputTemplate available for the NormalizedOutputTemplatePlatforms-object via the googleAssistant-key.
declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    googleAssistant?: NormalizedGoogleAssistantOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('googleAssistant', NormalizedGoogleAssistantOutputTemplate);

export * from './decorators/validation/IsValidLineItemExtension';
export * from './decorators/validation/IsValidMediaObjectImage';
export * from './decorators/validation/IsValidOrderExtension';
export * from './decorators/validation/IsValidPaymentResultString';
export * from './decorators/validation/IsValidRichResponseItemArray';
export * from './decorators/validation/IsValidRichResponseItemObject';
export * from './decorators/validation/IsValidSimpleResponseString';

export * from './models';
export * from './constants';

export * from './GoogleAssistantOutputTemplateConverterStrategy';
export { convertMessageToGoogleAssistantSimpleResponse } from './utilities';
