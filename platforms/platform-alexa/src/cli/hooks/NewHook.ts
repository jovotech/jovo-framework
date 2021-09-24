import type { NewContext, NewEvents } from '@jovotech/cli-command-new';
import { Log, promptSupportedLocales } from '@jovotech/cli-core';
import { SupportedLocales } from '../constants';
import { AlexaContext, SupportedLocalesType } from '../interfaces';
import { AlexaHook } from './AlexaHook';

export class NewHook extends AlexaHook<NewEvents> {
  install(): void {
    this.middlewareCollection = {
      new: [this.setDefaultConfig.bind(this)],
    };
  }
  $context!: NewContext & AlexaContext;

  async setDefaultConfig(): Promise<void> {
    // Check for invalid locales and provide a default locale map.
    for (const locale of this.$context.locales) {
      if (!SupportedLocales.includes(locale as SupportedLocalesType)) {
        // Prompt user for alternative locale.
        Log.spacer();
        const { locales } = await promptSupportedLocales(
          locale,
          'Alexa',
          SupportedLocales as unknown as string[],
        );

        if (!locales.length) {
          continue;
        }

        if (!this.$plugin.$config.locales) {
          this.$plugin.$config.locales = {};
        }

        this.$plugin.$config.locales[locale] = locales as SupportedLocalesType[];
      }
    }
  }
}
