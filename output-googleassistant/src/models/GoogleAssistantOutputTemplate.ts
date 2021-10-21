import { DenormalizePlatformOutputTemplate } from '@jovotech/output';
import { NormalizedGoogleAssistantOutputTemplate } from './NormalizedGoogleAssistantOutputTemplate';

export type GoogleAssistantOutputTemplate =
  DenormalizePlatformOutputTemplate<NormalizedGoogleAssistantOutputTemplate>;
