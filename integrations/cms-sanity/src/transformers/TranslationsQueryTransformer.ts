import { Jovo } from '@jovotech/framework';
import {
  BaseSanityQueryTransformer,
  SanityQueryTransformerConfig,
} from './BaseSanityQueryTransformer';
import _get from 'lodash.get';
import _set from 'lodash.set';

export interface Resources {
  [key: string]: string | string[] | Resources;
}

interface SanityTranslationEntry {
  platform: string;
  locale: string;
  text: string;
}

interface SanityTranslation {
  key: string;
  defaultEntry: SanityTranslationEntry;
  additionalEntries?: SanityTranslationEntry[];
}

export class TranslationsQueryTransformer extends BaseSanityQueryTransformer {
  getDefaultConfig(): SanityQueryTransformerConfig {
    return {
      query: '',
    };
  }

  execute(values: SanityTranslation[], jovo: Jovo): Record<string, Resources> {
    const resources: Record<string, Resources> = {};

    for (const item of values) {
      const isValidLocale = this.processLocale(item.key, item.defaultEntry, resources);
      if (!isValidLocale) continue;

      for (const additionalItem of item.additionalEntries ?? []) {
        const isValidLocale = this.processLocale(item.key, additionalItem, resources);
        if (!isValidLocale) continue;
      }
    }

    // Feed resources to i18n, if configured
    for (const locale of Object.keys(resources)) {
      for (const key of Object.keys(resources[locale])) {
        if (key === 'translation') {
          jovo.$app.i18n.i18n.addResourceBundle(
            locale,
            'translation',
            resources[locale]['translation'],
          );
        } else {
          jovo.$app.i18n.i18n.addResourceBundle(
            locale,
            `${key}.translation`,
            (resources[locale][key] as Resources)['translation'],
          );
        }
      }
    }
    return resources;
  }

  private processLocale(
    key: string,
    item: SanityTranslationEntry,
    resources: Record<string, Resources>,
  ): boolean {
    // Check if locale has a valid format
    // Credit to https://stackoverflow.com/a/48300605/10204142
    if (
      !item.locale.match(
        /^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[0-9]{3}))?([_-]([A-Za-z]{2}|[0-9]{3}))?$/,
      )
    ) {
      return false;
    }

    const i18nKey = `${item.locale}${item.platform ? `.${item.platform}` : ''}.translation.${key}`;

    let existingValue: string | string[] = _get(resources, i18nKey) as unknown as string | string[];

    if (!existingValue) {
      _set(resources, i18nKey, item.text);
    } else {
      if (Array.isArray(existingValue)) {
        existingValue.push(item.text);
      } else {
        existingValue = [existingValue, item.text];
      }

      _set(resources, i18nKey, existingValue);
    }

    return true;
  }
}
