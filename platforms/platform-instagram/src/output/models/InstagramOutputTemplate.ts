import { DenormalizePlatformOutputTemplate } from '@jovotech/output';
import { NormalizedInstagramOutputTemplate } from './NormalizedInstagramOutputTemplate';

export type InstagramOutputTemplate =
  DenormalizePlatformOutputTemplate<NormalizedInstagramOutputTemplate>;
