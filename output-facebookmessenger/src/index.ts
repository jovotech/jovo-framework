import { registerOutputPlatform } from '@jovotech/output';
import {
  FacebookMessengerOutputTemplate,
  GenericTemplate,
  GenericTemplateElement,
  Message as FacebookMessengerMessage,
  QuickReply as FacebookMessengerQuickReply,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    toFacebookMessengerGenericTemplate?(): GenericTemplate;

    toFacebookMessengerGenericTemplateElement?(): GenericTemplateElement;
  }
}

declare module '@jovotech/output/dist/types/models/Carousel' {
  interface Carousel {
    toFacebookMessengerGenericTemplate?(): GenericTemplate;
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

// Make FacebookMessengerOutputTemplate available for the OutputTemplatePlatforms-object via the FacebookMessenger-key.
declare module '@jovotech/output/dist/types/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    FacebookMessenger?: FacebookMessengerOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('FacebookMessenger', FacebookMessengerOutputTemplate);

export * from './decorators/transformation/TransformButton';
export * from './decorators/validation/CastedMaxLength';
export * from './decorators/validation/IsValidGameMetaDataString';

export * from './models';
export * from './constants';

export * from './FacebookMessengerOutputTemplateConverterStrategy';
