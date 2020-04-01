import i18n = require('i18next');
import { Cms, ErrorCode, Extensible, HandleRequest, JovoError } from 'jovo-core';

import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');

import { DefaultSheet, GoogleSheetsSheet } from './DefaultSheet';

export interface Config extends GoogleSheetsSheet {
  spreadsheetId?: string;
  sheet?: string;
  range?: string;
  i18Next?: {
    load?: string;
    returnObjects?: boolean;
    interpolation?: {
      escapeValue: boolean;
    };
  };
}

export class ResponsesSheet extends DefaultSheet {
  config: Config = {
    enabled: true,
    i18Next: {
      interpolation: {
        escapeValue: false, // do not escape ssml tags
      },
      load: 'all',
      returnObjects: true,
    },
    range: 'A:Z',
  };

  constructor(config?: Config) {
    super(config);
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(extensible: Extensible) {
    super.install(extensible);
    Cms.prototype.t = function () {
      if (!this.$jovo) {
        return;
      }
      // @ts-ignore
      return this.$jovo.t.apply(this, arguments);
    };
  }

  parse(handleRequest: HandleRequest, values: any[]) {
    // tslint:disable-line
    const entity = this.config.entity || this.config.name;

    if (!entity) {
      throw new JovoError(
        'entity has to be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-googlesheets',
        `The sheet's name has to be defined in your config.js file.`,
        undefined,
        'https://www.jovo.tech/docs/cms/google-sheets#configuration',
      );
    }

    const headers: string[] = values[0];
    const platforms = handleRequest.app.getAppTypes();
    const resources: any = {}; // tslint:disable-line
    let tKey = '';

    for (let i = 1; i < values.length; i++) {
      const row: string[] = values[i];
      for (let j = 1; j < headers.length; j++) {
        const cell: string = row[j];
        let locale: string = headers[j];
        let platform: string | undefined;

        const localeSplit: string[] = locale.toLowerCase().split('-');

        // workaround for generic locales like en to work
        for (const p of platforms) {
          const indexOfPlatform = localeSplit.indexOf(p.toLowerCase());
          if (indexOfPlatform > -1) {
            localeSplit.splice(indexOfPlatform, 1);
            platform = p;
            this.cms!.baseApp.config.platformSpecificResponses = true;
          }
        }

        locale = localeSplit[0];

        if (localeSplit.length === 2) {
          locale = `${localeSplit[0]}-${localeSplit[1].toUpperCase()}`;
        }

        // match locale
        // thx to https://stackoverflow.com/a/48300605/10204142
        if (
          !locale.match(/^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[0-9]{3}))?([_-]([A-Za-z]{2}|[0-9]{3}))?$/)
        ) {
          continue;
        }
        // take key from the line above, if the key is empty
        tKey = row[0] !== '' ? row[0] : tKey;
        let key = `${locale}.translation.${tKey}`;
        if (platform) {
          key = `${locale}.${platform}.translation.${tKey}`;
        }

        if (!cell) {
          continue;
        }
        let value = cell;
        if (cell === '/') {
          value = '';
        }
        let existingKeyValue = _get(resources, key);
        // is key existing?
        if (!existingKeyValue) {
          _set(resources, key, value);
        } else {
          // add new element to existing array
          if (Array.isArray(existingKeyValue)) {
            existingKeyValue.push(value);
          } else {
            // create array from existing string and new value
            existingKeyValue = [existingKeyValue, value];
          }
          _set(resources, key, existingKeyValue);
        }
      }
    }

    if (!handleRequest.app.$cms.I18Next) {
      // @ts-ignore
      i18n.init(Object.assign({ resources }, this.config.i18Next)); // tslint:disable-line
      handleRequest.app.$cms.I18Next = { i18n };
    } else {
      Object.keys(resources).forEach((localeKey) => {
        const resource = resources[localeKey];

        for (const platform of platforms) {
          if (resource[platform]) {
            handleRequest.app.$cms.I18Next.i18n.addResourceBundle(
              localeKey,
              platform,
              resource[platform],
              true,
              true,
            );
          }
        }

        handleRequest.app.$cms.I18Next.i18n.addResourceBundle(
          localeKey,
          'translation',
          resource.translation,
          true,
          true,
        );
      });
    }

    handleRequest.app.$cms[entity] = resources;
  }
}
