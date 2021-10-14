import { Message as InstagramMessage, registerOutputPlatform } from '@jovotech/output';
import {
  convertMessageToFacebookMessengerMessage,
  GenericTemplate,
  GenericTemplateElement,
  QuickReply as InstagramQuickReply,
} from '@jovotech/output-facebookmessenger';
import { InstagramOutputTemplate } from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    toInstagramGenericTemplate?(): GenericTemplate;
    toInstagramGenericTemplateElement?(): GenericTemplateElement;
    toInstagramMessage?(): InstagramMessage;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    toInstagramGenericTemplate?(): GenericTemplate;
    toInstagramMessage?(): InstagramMessage;
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toInstagramMessage?(): InstagramMessage;
  }
}

declare module '@jovotech/output/dist/types/models/QuickReply' {
  interface QuickReply {
    toInstagramQuickReply?(): InstagramQuickReply;
  }
}

// Augment the prototypes of the generic models to have methods to convert to the Instagram-variant
augmentModelPrototypes();

// Make InstagramOutputTemplate available for the OutputTemplatePlatforms-object via the instagram-key
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    instagram?: InstagramOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property
registerOutputPlatform('instagram', InstagramOutputTemplate);

export * from '@jovotech/output-facebookmessenger';
export * from './models';
export * from './InstagramOutputTemplateConverterStrategy';
export { convertMessageToFacebookMessengerMessage as convertMessageToInstagramMessage };
