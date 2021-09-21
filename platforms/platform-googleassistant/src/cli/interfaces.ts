import { PluginConfig, PluginContext } from '@jovotech/cli-core';
import { UnknownObject } from '@jovotech/framework';
import { SupportedLocales } from './constants';

export interface GoogleActionProjectLocales {
  [modelLocale: string]: string | string[];
}

export interface GoogleActionActions {
  custom: {
    [key: string]: UnknownObject;
  };
}

export type SupportedLocalesType = typeof SupportedLocales[number];

export interface GoogleCliConfig extends PluginConfig {
  projectId: string;
  resourcesDirectory?: string;
  locales?: {
    [locale: string]: SupportedLocalesType[];
  };
}

export interface GoogleContext extends PluginContext {
  googleAssistant: {
    projectId?: string;
  };
}
