import { registerOutputPlatform, Message as InstagramMessage } from '@jovotech/output';
import {
  FacebookMessengerOutputTemplate as InstagramOutputTemplate,
  GenericTemplate,
  GenericTemplateElement,
  convertMessageToFacebookMessengerMessage,
  QuickReply as InstagramQuickReply,
  FacebookMessengerResponse as InstagramResponse,
} from '@jovotech/output-facebookmessenger';
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

// Augment the prototypes of the generic models to have methods to convert to the FacebookMessenger-variant
augmentModelPrototypes();

// Make FacebookMessengerOutputTemplate available for the OutputTemplatePlatforms-object via the facebookMessenger-key.
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    instagram?: InstagramOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('instagram', InstagramOutputTemplate);

// TODO: Export as Instagram Types!
// export * from './decorators/transformation/TransformButton';
// export * from './decorators/validation/CastedMaxLength';
// export * from './decorators/validation/IsValidGameMetaDataString';
//
// export * from './models';
// export * from './constants';
//
// export * from './FacebookMessengerOutputTemplateConverterStrategy';
export {
  convertMessageToFacebookMessengerMessage as convertMessageToInstagramMessage,
  InstagramResponse,
};
