import type { NewContext, NewEvents } from '@jovotech/cli-command-new';
import { Log, PluginHook, printHighlight, printUserInput, prompt } from '@jovotech/cli-core';
import { SupportedLocales } from '../constants';
import { SupportedLocalesType } from '../interfaces';

export class NewHook extends PluginHook<NewEvents> {
  install(): void {
    this.middlewareCollection = {
      new: [this.setDefaultConfig.bind(this)],
    };
  }
  $context!: NewContext;

  async setDefaultConfig(): Promise<void> {
    // Check for invalid locales and provide a default locale map.
    for (const locale of this.$context.locales) {
      if (!SupportedLocales.includes(locale as SupportedLocalesType)) {
        // Prompt user for alternative locale.
        Log.spacer();
        const { locales } = await prompt(
          {
            name: 'locales',
            type: 'autocompleteMultiselect',
            message: `Locale ${printHighlight(
              locale,
            )} is not supported by Alexa.\nPlease provide an alternative locale (type to filter, select with space):`,
            instructions: false,
            choices: SupportedLocales.map((locale) => ({
              title: printUserInput(locale),
              value: locale,
            })),
          },
          {
            onCancel() {
              process.exit();
            },
          },
        );

        if (!locales.length) {
          continue;
        }

        if (!this.$plugin.$config.locales) {
          this.$plugin.$config.locales = {};
        }

        this.$plugin.$config.locales[locale] = locales;
      }
    }
  }
}
