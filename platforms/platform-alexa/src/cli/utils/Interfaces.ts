import { PluginConfig, PluginContext } from '@jovotech/cli-core';

export interface AskSkillList {
  skills: [
    {
      skillId: string;
      stage: string | undefined;
      nameByLocale: {
        [key: string]: string;
      };
      lastUpdated: string;
    },
  ];
}

export interface PluginContextAlexa extends PluginContext {
  skillId?: string;
  askProfile?: string;
}

export interface PluginConfigAlexa extends PluginConfig {
  askProfile?: string;
}
