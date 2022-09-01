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
    en: {
      start: 'StartIntent',
      'learn more': 'LearnMoreIntent',
    },
    de: {
      start: 'StartIntent',
      mehr: 'LearnMoreIntent',
    }
  }
*/
export interface KeywordMap {
  [locale: string]: Record<string, string>;
}

export interface KeywordNluPluginConfig extends PluginConfig {
  onGetReplaceMap?: (jovo: Jovo) => KeywordMap | Promise<KeywordMap>;
  onReplace: (jovo: Jovo, locale: string, replaceMap: KeywordMap, text: string) => string | Promise<string>;
  keywordMap: KeywordMap;
  fallbackLocale: string;
}

export class KeywordNluPlugin extends Plugin<KeywordNluPluginConfig> {
  getDefaultConfig(): KeywordNluPluginConfig {
    return {
      keywordMap: {},
      fallbackLocale: 'en',
      onReplace: this.replaceText,
    };
  }

  install(app: Extensible) {
    if (!(app instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
  }

  mount(parent: Extensible): Promise<void> | void {
    parent.middlewareCollection.use('before.interpretation.nlu', async (jovo: Jovo) => {
      let text = jovo.$input.getText()?.toLowerCase();
      const locale = this.getLocale(jovo);

      // replace strings
      if (text && this.config.onGetReplaceMap) {
        const replaceMap = await this.config.onGetReplaceMap(jovo);
        text = await this.config.onReplace(jovo, locale, replaceMap, text);
      }

      // keywordMap
      if (text && this.config.keywordMap[locale]?.hasOwnProperty(text)) {
        jovo.$input.intent = this.config.keywordMap[locale][text];

        // If a keyword matches, skip other NLU integrations for better performance
        jovo.$handleRequest.skipMiddlewares('interpretation.nlu');
      }
    });
  }

  protected getLocale(jovo: Jovo): string {
    const locale = jovo.$request.getLocale() || this.config.fallbackLocale;

    // Only use generic locales like 'en' instead of e.g. 'en-US'
    const genericLocale = locale.split('-')[0];

    return genericLocale;
  }

  private replaceText(jovo: Jovo, locale: string, replaceMap: KeywordMap, text: string): string | Promise<string> {
    if (replaceMap?.hasOwnProperty(locale)) {
      const list = (replaceMap as any)[locale];
      for (const [key, value] of Object.entries(list)) {
        text = text.replaceAll(key, value as string);
      }
    }

    return text;
  }
}
