import {
  App,
  Extensible,
  InvalidParentError,
  Jovo,
  Plugin,
  PluginConfig,
} from '@jovotech/framework';

/* Example
  {
    start: 'StartIntent',
    'learn more': 'LearnMoreIntent',
  }
*/
export interface KeywordNluPluginConfig extends PluginConfig {
  keywordMap: Record<string, string>;
}

export class KeywordNluPlugin extends Plugin<KeywordNluPluginConfig> {
  getDefaultConfig(): KeywordNluPluginConfig {
    return {
      keywordMap: {},
    };
  }

  install(app: Extensible) {
    if (!(app instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
  }

  mount(parent: Extensible): Promise<void> | void {
    parent.middlewareCollection.use('before.interpretation.nlu', (jovo: Jovo) => {
      const text = jovo.$input.getText()?.toLowerCase();

      if (text && this.config.keywordMap.hasOwnProperty(text)) {
        jovo.$input.intent = this.config.keywordMap[text];

        // If a keyword matches, skip other NLU integrations for better performance
        jovo.$handleRequest.skipMiddlewares('interpretation.nlu');
      }
    });
  }
}
