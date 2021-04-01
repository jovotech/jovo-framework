import { JovoCliPluginContext } from '@jovotech/cli-core';

export interface GoogleActionProjectLocales {
  [modelLocale: string]: string | string[];
}

export interface GoogleActionActions {
  custom: {
    [key: string]: object;
  };
}

export interface PluginContextGoogle extends JovoCliPluginContext {
  projectId?: string;
}
