import { registerOutputPlatform } from '@jovotech/output';
import { AlexaOutput, Card, CardType, OutputSpeech, OutputSpeechType } from './models';
import { augmentGenericPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/GenericCard' {
  interface GenericCard {
    toAlexaCard?(): Card<CardType.Standard>;
  }
}

declare module '@jovotech/output/dist/models/GenericMessage' {
  interface GenericMessage {
    toAlexaOutputSpeech?(): OutputSpeech<OutputSpeechType.Ssml>;
  }
}

// augment the prototypes of the generic models to have methods to convert to the Alexa-variant
augmentGenericPrototypes();

// Make AlexaOutput available for the OutputTemplatePlatforms-object via the Alexa-key.
declare module '@jovotech/output/dist/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    Alexa?: AlexaOutput;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('Alexa', AlexaOutput);

export * from './decorators/validation/IsValidCardImage';
export * from './decorators/validation/IsValidCardImageUrl';
export * from './decorators/validation/IsValidCardString';
export * from './decorators/validation/IsValidAlexaString';
export * from './decorators/validation/IsValidOutputSpeechString';

export * from './models';

export * from './AlexaOutputTemplateConverterStrategy';

export { validateAlexaString } from './utilities';
