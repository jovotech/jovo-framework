import { OmitIndex } from '@jovotech/common';
import { MessageValue } from './Message';
import { NormalizedOutputTemplate } from './NormalizedOutputTemplate';
import { OutputTemplatePlatforms } from './OutputTemplatePlatforms';

// Construct an object-type that has the same keys as NormalizedOutputTemplate but additionally allows an array to be passed to message and reprompt.
// Also, updates type of platforms to reference OutputTemplatePlatforms
export type DenormalizeOutputTemplate<OUTPUT_TEMPLATE extends NormalizedOutputTemplate> = Omit<
  OmitIndex<OUTPUT_TEMPLATE>,
  'message' | 'reprompt' | 'platforms'
> & {
  [key: string]: unknown;
  message?: OUTPUT_TEMPLATE['message'] | MessageValue[];
  reprompt?: OUTPUT_TEMPLATE['reprompt'] | MessageValue[];
  platforms?: OutputTemplatePlatforms;
};

// Make it an interface to be able to augment it
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OutputTemplate extends DenormalizeOutputTemplate<NormalizedOutputTemplate> {}
