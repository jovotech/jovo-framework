import { PluginConfig, PluginContext } from '@jovotech/cli-core';

export interface GoogleActionProjectLocales {
  [modelLocale: string]: string | string[];
}

export interface GoogleActionActions {
  custom: {
    [key: string]: object;
  };
}

export interface PluginConfigGoogle extends PluginConfig {
  projectId?: string;
}

export interface PluginContextGoogle extends PluginContext {
  projectId?: string;
}
