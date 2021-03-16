import { registerOutputPlatform } from '@jovotech/output';
import {
  Card,
  Collection,
  GoogleAssistantOutput,
  Simple,
  Suggestion,
  TypeOverride,
} from './models';
import { augmentGenericPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/GenericCard' {
  interface GenericCard {
    toGoogleAssistantCard?(): Card;
  }
}

declare module '@jovotech/output/dist/models/GenericCarousel' {
  interface GenericCarousel {
    toGoogleAssistantCollectionData?(): { collection: Collection; typeOverride: TypeOverride };
  }
}

declare module '@jovotech/output/dist/models/GenericMessage' {
  interface GenericMessage {
    toGoogleAssistantSimple?(): Simple;
  }
}

declare module '@jovotech/output/dist/models/GenericQuickReply' {
  interface GenericQuickReply {
    toGoogleAssistantSuggestion?(): Suggestion;
  }
}

// augment the prototypes of the generic models to have methods to convert to the GoogleAssistant-variant
augmentGenericPrototypes();

// Make GoogleAssistantOutput available for the OutputTemplatePlatforms-object via the GoogleAssistant-key.
declare module '@jovotech/output/dist/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    GoogleAssistant?: GoogleAssistantOutput;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('GoogleAssistant', GoogleAssistantOutput);

export * from './models';

export * from './GoogleAssistantOutputTemplateConverterStrategy';
