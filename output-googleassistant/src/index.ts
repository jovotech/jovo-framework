import { registerOutputPlatform } from '@jovotech/output';
import {
  Card as GoogleAssistantCard,
  Collection,
  GoogleAssistantOutputTemplate,
  Simple,
  Suggestion,
  TypeOverride,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    toGoogleAssistantCard?(): GoogleAssistantCard;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    toGoogleAssistantCollectionData?(): { collection: Collection; typeOverride: TypeOverride };
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toGoogleAssistantSimple?(): Simple;
  }
}

declare module '@jovotech/output/dist/types/models/QuickReply' {
  interface QuickReply {
    toGoogleAssistantSuggestion?(): Suggestion;
  }
}

// augment the prototypes of the generic models to have methods to convert to the GoogleAssistant-variant
augmentModelPrototypes();

// Make GoogleAssistantOutputTemplate available for the OutputTemplatePlatforms-object via the googleAssistant-key.
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    googleAssistant?: GoogleAssistantOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('googleAssistant', GoogleAssistantOutputTemplate);

export * from './models';
export * from './constants';

export * from './GoogleAssistantOutputTemplateConverterStrategy';
export { convertMessageToGoogleAssistantSimple } from './utilities';
