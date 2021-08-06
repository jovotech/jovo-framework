import { registerOutputPlatform } from '@jovotech/output';
import { CarouselCard, GoogleBusinessOutputTemplate, RichCard, StandaloneCard, Suggestion } from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    toGoogleBusinessCard?(): StandaloneCard;
    toGoogleBusinessRichCard?(): RichCard;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    toGoogleBusinessCarousel?(): CarouselCard;
    toGoogleBusinessRichCard?(): RichCard;
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toGoogleBusinessText?(): string;
  }
}

declare module '@jovotech/output/dist/types/models/QuickReply' {
  interface QuickReply {
    toGoogleBusinessSuggestion?(): Suggestion;
  }
}

// augment the prototypes of the generic models to have methods to convert to the GoogleAssistant-variant
augmentModelPrototypes();

// Make GoogleAssistantOutputTemplate available for the OutputTemplatePlatforms-object via the GoogleAssistant-key.
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    GoogleBusiness?: GoogleBusinessOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('GoogleBusiness', GoogleBusinessOutputTemplate);

export * from './decorators/validation/IsValidRichCardObject';
export * from './decorators/validation/IsValidSuggestedActionObject';
export * from './decorators/validation/IsValidSuggestionObject';

export * from './models';
export * from './constants';

export * from './GoogleBusinessOutputTemplateConverterStrategy';
