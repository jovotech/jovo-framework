import { registerOutputPlatform } from '@jovotech/output';
import { BasicCard, Carousel, GoogleAssistantOutput, SimpleResponse, Suggestion } from './models';
import { augmentGenericPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/GenericCard' {
  interface GenericCard {
    toGoogleAssistantBasicCard?(): BasicCard;
  }
}

declare module '@jovotech/output/dist/models/GenericCarousel' {
  interface GenericCarousel {
    toGoogleAssistantCarousel?(): Carousel;
  }
}

declare module '@jovotech/output/dist/models/GenericMessage' {
  interface GenericMessage {
    toGoogleAssistantSimpleResponse?(): SimpleResponse;
  }
}

declare module '@jovotech/output/dist/models/GenericQuickReply' {
  interface GenericQuickReply {
    toGoogleAssistantSuggestion?(): Suggestion;
  }
}

// augment the prototypes of the generic models to have methods to convert to the GoogleAssistant-variant
augmentGenericPrototypes();

// Make GoogleAssistantOutput available for the GenericOutputPlatforms-object via the GoogleAssistant-key.
declare module '@jovotech/output/dist/models/GenericOutputPlatforms' {
  interface GenericOutputPlatforms {
    GoogleAssistant?: GoogleAssistantOutput;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('GoogleAssistant', GoogleAssistantOutput);

export * from './decorators/validation/IsValidLineItemExtension';
export * from './decorators/validation/IsValidMediaObjectImage';
export * from './decorators/validation/IsValidOrderExtension';
export * from './decorators/validation/IsValidPaymentResultString';
export * from './decorators/validation/IsValidRichResponseItemArray';
export * from './decorators/validation/IsValidRichResponseItemObject';
export * from './decorators/validation/IsValidSimpleResponseString';

export * from './models';

export * from './GoogleAssistantOutputConverterStrategy';
