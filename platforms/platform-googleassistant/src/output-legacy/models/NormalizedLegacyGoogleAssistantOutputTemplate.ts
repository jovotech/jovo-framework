import { NormalizedPlatformOutputTemplate, Type } from '@jovotech/output';
import { LegacyGoogleAssistantOutputTemplateResponse } from './LegacyGoogleAssistantOutputTemplateResponse';

export class NormalizedLegacyGoogleAssistantOutputTemplate extends NormalizedPlatformOutputTemplate<LegacyGoogleAssistantOutputTemplateResponse> {
  @Type(() => LegacyGoogleAssistantOutputTemplateResponse)
  nativeResponse?: LegacyGoogleAssistantOutputTemplateResponse;
}
