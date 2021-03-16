import { registerOutputPlatform } from '@jovotech/output';
import {
  FacebookMessengerOutput,
  GenericTemplate,
  GenericTemplateElement,
  Message as FacebookMessengerMessage,
  QuickReply as FacebookMessengerQuickReply,
} from './models';
import { augmentGenericPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/GenericCard' {
  interface GenericCard {
    toFacebookMessengerGenericTemplate?(): GenericTemplate;
    toFacebookMessengerGenericTemplateElement?(): GenericTemplateElement;
  }
}

declare module '@jovotech/output/dist/models/GenericCarousel' {
  interface GenericCarousel {
    toFacebookMessengerGenericTemplate?(): GenericTemplate;
  }
}

declare module '@jovotech/output/dist/models/GenericMessage' {
  interface GenericMessage {
    toFacebookMessengerMessage?(): FacebookMessengerMessage;
  }
}

declare module '@jovotech/output/dist/models/GenericQuickReply' {
  interface GenericQuickReply {
    toFacebookQuickReply?(): FacebookMessengerQuickReply;
  }
}

// augment the prototypes of the generic models to have methods to convert to the FacebookMessenger-variant
augmentGenericPrototypes();

// Make FacebookMessengerOutput available for the GenericOutputPlatforms-object via the FacebookMessenger-key.
declare module '@jovotech/output/dist/models/GenericOutputPlatforms' {
  interface GenericOutputPlatforms {
    FacebookMessenger?: FacebookMessengerOutput;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('FacebookMessenger', FacebookMessengerOutput);

export * from './decorators/transformation/TransformButton';
export * from './decorators/validation/CastedMaxLength';
export * from './decorators/validation/IsValidGameMetaDataString';

export * from './models';

export * from './FacebookMessengerOutputConverterStrategy';
