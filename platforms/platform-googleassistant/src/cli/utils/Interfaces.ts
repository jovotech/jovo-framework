import { PluginConfig, PluginContext } from '@jovotech/cli-core';
import { SupportedLocales } from './Constants';

export interface GoogleActionProjectLocales {
  [modelLocale: string]: string | string[];
}

export interface GoogleActionActions {
  custom: {
    [key: string]: Record<string, unknown>;
  };
}

export type SupportedLocalesType = typeof SupportedLocales[number];

export interface PluginConfigGoogle extends PluginConfig {
  projectId?: string;
  locales?: {
    [locale: string]: SupportedLocalesType[];
  };
}

export interface PluginContextGoogle extends PluginContext {
  projectId?: string;
}
