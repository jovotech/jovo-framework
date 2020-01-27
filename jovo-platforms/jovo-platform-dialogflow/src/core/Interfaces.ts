import { TestSuite } from 'jovo-core';
import { DialogflowRequestBuilder } from './DialogflowRequestBuilder';
import { DialogflowResponseBuilder } from './DialogflowResponseBuilder';

export interface DialogflowTestSuite
  extends TestSuite<DialogflowRequestBuilder, DialogflowResponseBuilder> {}

export interface SessionEntityType {
  name: string;
  entities: SessionEntity[];
  // Defines whether to override or supplement existing custom entities
  entityOverrideMode?: 'ENTITY_OVERRIDE_MODE_OVERRIDE' | 'ENTITY_OVERRIDE_MODE_SUPPLEMENT';
}

export interface SessionEntity {
  value: string;
  synonyms: string[];
}
