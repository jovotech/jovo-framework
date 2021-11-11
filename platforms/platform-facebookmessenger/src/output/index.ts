import { registerOutputPlatform } from '@jovotech/output';
import {
  Button,
  NormalizedFacebookMessengerOutputTemplate,
  GenericTemplate,
  GenericTemplateDefaultAction,
  GenericTemplateElement,
  Message as FacebookMessengerMessage,
  QuickReply as FacebookMessengerQuickReply,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    buttons?: Button[];
    defaultAction?: GenericTemplateDefaultAction;

    toFacebookMessengerGenericTemplate?(): GenericTemplate;
    toFacebookMessengerGenericTemplateElement?(): GenericTemplateElement;
    toFacebookMessengerMessage?(): FacebookMessengerMessage;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    toFacebookMessengerGenericTemplate?(): GenericTemplate;
    toFacebookMessengerMessage?(): FacebookMessengerMessage;
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toFacebookMessengerMessage?(): FacebookMessengerMessage;
  }
}

declare module '@jovotech/output/dist/types/models/QuickReply' {
  interface QuickReply {
    toFacebookQuickReply?(): FacebookMessengerQuickReply;
  }
}

// augment the prototypes of the generic models to have methods to convert to the FacebookMessenger-variant
augmentModelPrototypes();

// Make NormalizedFacebookMessengerOutputTemplate available for the NormalizedOutputTemplatePlatforms-object via the facebookMessenger-key.
declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    facebookMessenger?: NormalizedFacebookMessengerOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('facebookMessenger', NormalizedFacebookMessengerOutputTemplate);

export * from './decorators/transformation/TransformButton';
export * from './decorators/transformation/TransformTemplate';
export * from './decorators/transformation/TransformQuickReply';
export * from './decorators/validation/CastedMaxLength';
export * from './decorators/validation/IsValidGameMetaDataString';

export * from './models';
export * from './constants';

export * from './FacebookMessengerOutputTemplateConverterStrategy';
export { convertMessageToFacebookMessengerMessage } from './utilities';
