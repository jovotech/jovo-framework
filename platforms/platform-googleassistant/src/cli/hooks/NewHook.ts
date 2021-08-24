import type { NewContext, NewEvents } from '@jovotech/cli-command-new';
import { Log, PluginHook, printHighlight, printUserInput, prompt } from '@jovotech/cli-core';
import { SupportedLocalesType } from '../interfaces';
import { SupportedLocales } from '../utilities';

export class NewHook extends PluginHook<NewEvents> {
  $context!: NewContext;

  install(): void {
    this.middlewareCollection = {
      new: [this.setDefaultConfig.bind(this)],
    };
  }

  async setDefaultConfig(): Promise<void> {
    // Check for invalid locales and provide a default locale map.
    for (const locale of this.$context.locales) {
      if (!SupportedLocales.includes(locale as SupportedLocalesType)) {
        Log.spacer();
        // Prompt user for alternative locale.
        const { locales } = await prompt(
          {
            name: 'locales',
            type: 'autocompleteMultiselect',
            message: `Locale ${printHighlight(
              locale,
            )} is not supported by Google Assistant.\nPlease provide an alternative locale (type to filter, select with space):`,
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
