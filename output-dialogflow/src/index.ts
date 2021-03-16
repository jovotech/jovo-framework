import { registerOutputPlatform } from '@jovotech/output';
import { Card, DialogflowOutput, Text } from './models';
import { augmentGenericPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/GenericCard' {
  interface GenericCard {
    toDialogflowCard?(): Card;
  }
}

declare module '@jovotech/output/dist/models/GenericMessage' {
  interface GenericMessage {
    toDialogflowText?(): Text;
  }
}

declare module '@jovotech/output/dist/models/GenericQuickReply' {
  interface GenericQuickReply {
    toDialogflowQuickReply?(): string;
  }
}

// augment the prototypes of the generic models to have methods to convert to the Dialogflow-variant
augmentGenericPrototypes();

// Make DialogflowOutput available for the OutputTemplatePlatforms-object via the Dialogflow-key.
declare module '@jovotech/output/dist/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    Dialogflow?: DialogflowOutput;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('Dialogflow', DialogflowOutput);

export * from './decorators/validation/EntitySynonymsContainValue';
export * from './decorators/validation/IsValidMessageContentObject';
export * from './decorators/validation/IsValidRbmSuggestionContentObject';
export * from './decorators/validation/IsValidRbmSuggestedActionContentObject';
export * from './decorators/validation/IsValidTelephonySynthesizeSpeechString';

export * from './DialogflowOutputTemplateConverterStrategy';

export * from './models';
