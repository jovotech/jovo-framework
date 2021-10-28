import { registerOutputPlatform } from '@jovotech/output';
import { Card as DialogflowCard, NormalizedDialogflowOutputTemplate, Text } from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/types/models/Card' {
  interface Card {
    toDialogflowCard?(): DialogflowCard;
  }
}

declare module '@jovotech/output/dist/types/models/Message' {
  interface Message {
    toDialogflowText?(): Text;
  }
}

declare module '@jovotech/output/dist/types/models/QuickReply' {
  interface QuickReply {
    toDialogflowQuickReply?(): string;
  }
}

// augment the prototypes of the generic models to have methods to convert to the Dialogflow-variant
augmentModelPrototypes();

// Make NormalizedDialogflowOutputTemplate available for the NormalizedOutputTemplatePlatforms-object via the dialogflow-key.
declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    dialogflow?: NormalizedDialogflowOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('dialogflow', NormalizedDialogflowOutputTemplate);

export * from './decorators/validation/EntitySynonymsContainValue';
export * from './decorators/validation/IsValidMessageContentObject';
export * from './decorators/validation/IsValidRbmSuggestionContentObject';
export * from './decorators/validation/IsValidRbmSuggestedActionContentObject';
export * from './decorators/validation/IsValidTelephonySynthesizeSpeechString';

export * from './DialogflowOutputTemplateConverterStrategy';

export * from './models';
export * from './constants';

export { convertMessageToDialogflowText } from './utilities';
