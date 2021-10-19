import { DenormalizeOutputTemplate } from '../utilities';
import { NormalizedOutputTemplate } from './NormalizedOutputTemplate';

// Make it an interface to be able to augment it
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OutputTemplate extends DenormalizeOutputTemplate<NormalizedOutputTemplate> {}
