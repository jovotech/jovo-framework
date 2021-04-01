import { JovoCliPluginConfig, JovoCliPluginContext } from '@jovotech/cli-core';

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

export interface JovoCliPluginContextAlexa extends JovoCliPluginContext {
  skillId?: string;
  askProfile?: string;
}

export interface JovoCliPluginConfigAlexa extends JovoCliPluginConfig {
  askProfile?: string;
  locales?: { [key: string]: string[] };
}
