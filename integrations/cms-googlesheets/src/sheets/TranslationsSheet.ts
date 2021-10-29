import _get from 'lodash.get';
import _set from 'lodash.set';
import { Jovo, App, AppInitConfig, Platform, Plugin } from '@jovotech/framework';
import { GaxiosPromise } from 'gaxios';
import { sheets_v4 } from 'googleapis';
import { GoogleSheetsCmsConfig } from '..';
import { GoogleSheetsCmsSheet, GoogleSheetsCmsSheetConfig } from './GoogleSheetsCmsSheet';

export interface TranslationsSheetConfig extends GoogleSheetsCmsSheetConfig {
  i18n?: {
    load: string;
  };
}

export interface Resources {
  [key: string]: string | string[] | Resources;
}

export class TranslationsSheet extends GoogleSheetsCmsSheet<TranslationsSheetConfig> {
  getDefaultConfig(): TranslationsSheetConfig {
    return { range: 'A:Z' };
  }

  parse(jovo: Jovo, values: string[][]): Record<string, Resources> {
    const headers: string[] = values.shift()!;
    const resources: Record<string, Resources> = {};
    const platforms: Platform[] = Object.values(jovo.$plugins).filter(
      (plugin) => plugin!.constructor.prototype instanceof Platform,
    ) as Platform[];
    let key = '';

    for (const row of values) {
      // If the current key is empty, take the previous one
      key = row[0] && row[0] !== '' ? row[0] : key;

      for (let i = 1; i < headers.length; i++) {
        const cell: string | undefined = row[i];

        if (!cell) {
          continue;
        }

        // Store an empty value if cell contains "/"
        const cellValue: string = cell === '/' ? '' : cell;
        const header: string = headers[i];

        const platform: Platform | undefined = platforms.find(
          (platform) => header.split(':').indexOf(platform.id) > 0,
        );

        let locale: string;

        if (platform) {
          locale = header.split(':').shift()!;
        } else {
          locale = header;
        }

        // Check if locale has a valid format
        // Credit to https://stackoverflow.com/a/48300605/10204142
        if (
          !locale.match(/^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[0-9]{3}))?([_-]([A-Za-z]{2}|[0-9]{3}))?$/)
        ) {
          continue;
        }

        const i18nKey = `${locale}${platform ? `.${platform.id}` : ''}.translation.${key}`;

        let existingValue: string | string[] = _get(resources, i18nKey) as unknown as
          | string
          | string[];

        if (!existingValue) {
          _set(resources, i18nKey, cellValue);
        } else {
          if (Array.isArray(existingValue)) {
            existingValue.push(cellValue);
          } else {
            existingValue = [existingValue, cellValue];
          }

          _set(resources, i18nKey, existingValue);
        }
      }
    }

    console.log(JSON.stringify(resources));
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
            // @ts-ignore
            resources[locale][key]['translation'],
          );
        }
      }
    }
    return resources;
  }
}
