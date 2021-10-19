import { DenormalizePlatformOutputTemplate } from '../utilities';
import { NormalizedPlatformOutputTemplate } from './NormalizedPlatformOutputTemplate';

export type PlatformOutputTemplate<
  RESPONSE extends Record<string, unknown> = Record<string, unknown>,
> = DenormalizePlatformOutputTemplate<NormalizedPlatformOutputTemplate<RESPONSE>>;
