import { PluginHook, prompt, printUserInput, printHighlight } from '@jovotech/cli-core';
import { NewEvents } from '@jovotech/cli-command-new';
import { SupportedLocales } from '../utils/Constants';
import { SupportedLocalesType } from '../utils';

export class NewHook extends PluginHook<NewEvents> {
  install(): void {
    this.middlewareCollection = {
      new: [this.setDefaultConfig.bind(this)],
    };
  }

  async setDefaultConfig(): Promise<void> {
    // Check for invalid locales and provide a default locale map.
    for (const locale of this.$context.locales) {
      if (!SupportedLocales.includes(locale as SupportedLocalesType)) {
        console.log();
        // Prompt user for alternative locale.
        const { locales } = await prompt(
          {
            name: 'locales',
            type: 'autocompleteMultiselect',
            message: `Locale ${printHighlight(
              locale,
            )} is not supported by Google Assistant. Please provide an alternative locale:`,
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
