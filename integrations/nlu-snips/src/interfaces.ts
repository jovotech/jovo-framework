import { PluginConfig } from '@jovotech/framework';
import { JovoModelData } from 'jovo-model';

export interface SnipsNluSlot {
  entity: string;
  range: {
    start: number;
    end: number;
  };
  rawValue: string;
  slotName: string;
  value: {
    kind: string;
    value: string;
  };
}

export interface SnipsNluResponse {
  input: string;
  intent: {
    intentName?: string;
    probability: number;
  };
  slots: SnipsNluSlot[];
}

export interface SnipsNluConfig extends PluginConfig {
  // TODO: Better naming?
  serverUrl: string;
  serverPath: string;
  engineId: string;
  fallbackLanguage: string;
  dynamicEntities?: {
    enabled: boolean;
    serverPath: string;
    modelsDirectory?: string;
    models?: Record<string, JovoModelData>;
    passModels?: boolean;
  };
}
