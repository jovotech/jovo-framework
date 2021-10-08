import type { NewContext, NewEvents } from '@jovotech/cli-command-new';
import { Log, PluginHook, promptSupportedLocales } from '@jovotech/cli-core';
import { GoogleAssistantCli } from '..';
import { SupportedLocalesType } from '../interfaces';
import { SupportedLocales } from '../utilities';

export class NewHook extends PluginHook<NewEvents> {
  readonly $plugin!: GoogleAssistantCli;
  readonly $context!: NewContext;

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
        const { locales } = await promptSupportedLocales(
          locale,
          'GoogleAssistant',
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
