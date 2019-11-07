import { ActionSet, EnumRequestType, Extensible, Jovo, Plugin, PluginConfig } from 'jovo-core';

export interface Config extends PluginConfig {
  defaultIntent?: string;
  defaultLocale?: string;
  minConfidence?: number;
  projectId?: string;
  apiKey?: string;
  authToken?: string;
}

export class DialogflowNlu extends Extensible implements Plugin {
  config: Config = {
    defaultIntent: 'DefaultFallbackIntent',
    defaultLocale: 'en-US',
    minConfidence: 0,
    projectId: process.env.DIALOGFLOW_PROJECT_ID || '',
    apiKey: process.env.DIALOGFLOW_API_KEY || '',
    authToken: process.env.DIALOGFLOW_AUTH_TOKEN || '',
  };

  constructor(config?: Config) {
    super(config);

    this.actionSet = new ActionSet(['$init', '$nlu', '$inputs'], this);
  }

  install(parent: Extensible) {
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async nlu(jovo: Jovo) {
    await this.middleware('$init')!.run(jovo);
    await this.middleware('$nlu')!.run(jovo);
  }

  async inputs(jovo: Jovo) {
    if (jovo.$nlu && jovo.$nlu.Dialogflow && jovo.$type.type === EnumRequestType.INTENT) {
      await this.middleware('$inputs')!.run(jovo);
    }
  }
}
