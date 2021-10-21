import type { AnyObject } from '@jovotech/framework';
import type { Message } from '@jovotech/output-dialogflow';

export interface DetectIntentRequest {
  queryParams?: {
    timeZone?: string;
    geoLocation?: {
      latitude: number;
      longitude: number;
    };
    contexts?: Context[];
    resetContexts?: boolean;
    sessionEntityTypes?: SessionEntityType[];
    payload?: AnyObject;
    sentimentAnalysisRequestConfig?: SentimentAnalysisRequestConfig;
    webhookHeaders?: Record<string, string>;
  };
  queryInput: {
    text: TextInput;
  };
}
export interface Context {
  name: string;
  lifespanCount?: number;
  parameters?: AnyObject;
}

export interface TextInput {
  text: string;
  languageCode: string;
}

export enum EntityOverrideMode {
  Unspecified = 'ENTITY_OVERRIDE_MODE_UNSPECIFIED',
  Override = 'ENTITY_OVERRIDE_MODE_OVERRIDE',
  Supplement = 'ENTITY_OVERRIDE_MODE_SUPPLEMENT',
}
export type EntityOverrideModeLike = `${EntityOverrideMode}` | EntityOverrideMode;

export interface SessionEntityType {
  name: string;
  entityOverrideMode: EntityOverrideModeLike;
  entities: DialogflowEntity[];
}

export interface DialogflowEntity {
  value: string;
  synonyms: string[];
}

export interface SentimentAnalysisRequestConfig {
  analyzeQueryTextSentiment: boolean;
}

export interface DetectIntentResponse {
  responseId: string;
  queryResult: {
    queryText: string;
    languageCode: string;
    action: string;
    parameters: AnyObject;
    allRequiredParamsPresent: boolean;
    fulfillmentText?: string;
    fulfillmentMessages?: Message[];
    webhookSource: string;
    webhookPayload?: AnyObject;
    outputContexts?: Context[];
    intent: DetectedIntent;
    intentDetectionConfidence: number;
    diagnosticInfo?: AnyObject;
    sentimentAnalysisResult?: {
      queryTextSentiment: {
        score: number;
        magnitude: number;
      };
    };
  };
  webhookStatus: {
    code: number;
    message: string;
  };
}

export interface DetectedIntent extends AnyObject {
  name: string;
  displayName: string;
  endInteraction: boolean;
  isFallback: boolean;
}
