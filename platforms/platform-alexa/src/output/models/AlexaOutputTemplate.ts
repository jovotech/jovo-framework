import { DenormalizePlatformOutputTemplate } from '@jovotech/output';
import { NormalizedAlexaOutputTemplate } from './NormalizedAlexaOutputTemplate';

export type AlexaOutputTemplate = DenormalizePlatformOutputTemplate<NormalizedAlexaOutputTemplate>;
