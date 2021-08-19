import { PluginConfig, PluginContext } from '@jovotech/cli-core';
import { SupportedLocales } from './constants';

export interface AskSkillList {
  skills: {
    skillId: string;
    stage: string | undefined;
    nameByLocale: {
      [key: string]: string;
    };
    lastUpdated: string;
  }[];
}

export type SupportedLocalesType = typeof SupportedLocales[number];

export interface AlexaCliConfig extends PluginConfig {
  askProfile?: string;
  locales?: {
    [locale: string]: SupportedLocalesType[];
  };
}

export interface AlexaContext extends PluginContext {
  alexa: {
    skillId?: string;
    askProfile?: string;
  };
}
