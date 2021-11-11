import type { NewContext, NewEvents } from '@jovotech/cli-command-new';
import { Log, PluginHook, promptSupportedLocales } from '@jovotech/cli-core';
import { DialogflowCli } from '..';
import { SupportedLocales, SupportedLocalesType } from '../utilities';

export class NewHook extends PluginHook<NewEvents> {
  $plugin!: DialogflowCli;
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
        // Prompt user for alternative locale.
        Log.spacer();
        const { locales } = await promptSupportedLocales(
          locale,
          'Dialogflow',
          SupportedLocales as unknown as string[],
        );

        if (!locales.length) {
          continue;
        }

        if (!this.$plugin.config.locales) {
          this.$plugin.config.locales = {};
        }

        this.$plugin.config.locales[locale] = locales as SupportedLocalesType[];
      }
    }
  }
}
