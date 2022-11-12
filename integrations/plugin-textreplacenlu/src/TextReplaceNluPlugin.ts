import {
  App,
  Extensible,
  InvalidParentError,
  Jovo,
  Plugin,
  PluginConfig,
} from '@jovotech/framework';

/* Example
  [
    {
      locales: ['en'],
      searchValue: 'world',
      replaceValue: 'jovo',
    },
    {
      locales: ['en'],
      searchValue: 'WORLD',
      replaceValue: 'jovo',
      isRegex: true,
      regexFlags: 'gi',
    },
    {
      locales: ['en'],
      searchValue: '(\\d+)(LBS)',
      replaceValue: "$1 pounds",
      isRegex: true,
      regexFlags: 'g',
    }
  ]
*/

export interface ReplaceRule {
  locales: string[];
  searchValue: string;
  replaceValue: string;
  isRegex?: boolean;
  regexFlags?: string;
}

export interface TextReplaceNluPluginConfig extends PluginConfig {
  onGetReplaceRules: (jovo: Jovo) => ReplaceRule[] | Promise<ReplaceRule[]>;
  onReplaceAll: (jovo: Jovo, locale: string, replaceRules: ReplaceRule[], text: string) => string | Promise<string>;
  fallbackLocale: string;
}

export class TextReplaceNluPlugin extends Plugin<TextReplaceNluPluginConfig> {
  config: any;
  getDefaultConfig(): TextReplaceNluPluginConfig {
    return {
      fallbackLocale: 'en',
      onGetReplaceRules: this.getReplaceRules,
      onReplaceAll: this.replaceAllText,
    };
  }

  install(app: Extensible) {
    if (!(app instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
  }

  mount(parent: Extensible): Promise<void> | void {
    parent.middlewareCollection.use('before.interpretation.nlu', (jovo: Jovo) => {
      let text = jovo.$input.getText();
      const locale = this.getLocale(jovo);

      if (text) {
        const rules = this.config.onGetReplaceRules(jovo);
        text = this.config.onReplaceAll(jovo, locale, rules, text);

        jovo.$input.text = text;
      }
    });
  }

  protected getLocale(jovo: Jovo): string {
    const locale = jovo.$request.getLocale() || this.config.fallbackLocale;
    return locale;
  }

  private replaceAllText(jovo: Jovo, locale: string, replaceRules: ReplaceRule[], text: string): string | Promise<string> {
    for (const rule of replaceRules) {
      if (!rule.searchValue || !rule.replaceValue) {
        continue;
      }

      const locales: string[] = rule.locales ?? [];
      const isRegex: boolean = rule.isRegex ?? false;

      if (locales.includes(locale)) {
        let searchValue: string | RegExp = rule.searchValue;

        if (isRegex) {
          const flags = rule.regexFlags ?? 'g';
          searchValue = new RegExp(rule.searchValue, flags);
        }

        text = text.replaceAll(searchValue, rule.replaceValue);
      }
    }

    return text;
  }

  private getReplaceRules(jovo: Jovo): ReplaceRule[] | Promise<ReplaceRule[]> {
    return [];
  }
}
