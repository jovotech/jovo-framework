import { registerOutputPlatform } from '@jovotech/output';
import {
  CoreOutputTemplate,
  SpeechAction,
  TextAction,
  VisualAction,
  QuickReply as CoreQuickReply,
} from './models';
import { augmentModelPrototypes } from './utilities';

declare module '@jovotech/output/dist/models/Card' {
  interface Card {
    toCoreVisualAction?(): VisualAction;
  }
}

declare module '@jovotech/output/dist/models/Message' {
  interface Message {
    toCoreTextAction?(): TextAction;
    toCoreSpeechAction?(): SpeechAction;
  }
}

declare module '@jovotech/output/dist/models/QuickReply' {
  interface QuickReply {
    toCoreQuickReply?(): CoreQuickReply;
  }
}

// augment the prototypes of the generic models to have methods to convert to the Core-variant
augmentModelPrototypes();

// Make CoreOutputTemplate available for the OutputTemplatePlatforms-object via the Core-key.
declare module '@jovotech/output/dist/models/OutputTemplatePlatforms' {
  interface OutputTemplatePlatforms {
    Core?: CoreOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('Core', CoreOutputTemplate);

export * from './decorators/validation/IsValidSpeechActionString';
export * from './decorators/transformation/TransformAction';
export * from './models';
export * from './CoreOutputTemplateConverterStrategy';
