import { PluginConfig, PluginContext } from '@jovotech/cli-core';
import { SupportedLocales } from './Constants';

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

export interface PluginConfigAlexa extends PluginConfig {
  askProfile?: string;
  locales: {
    [locale: string]: SupportedLocalesType[];
  };
}

export interface PluginContextAlexa extends PluginContext {
  skillId?: string;
  askProfile?: string;
}
