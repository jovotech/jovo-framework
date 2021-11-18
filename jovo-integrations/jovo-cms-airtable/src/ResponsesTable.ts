import * as i18n from 'i18next';

import { Cms, ErrorCode, Extensible, HandleRequest, JovoError } from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');

import { AirtableTable, DefaultTable } from './DefaultTable';

export interface Config extends AirtableTable {
  i18Next?: {
    load?: string;
    returnObjects?: boolean;
    interpolation?: {
      escapeValue: boolean;
    };
  };
}

export class ResponsesTable extends DefaultTable {
  config: Config = {
    enabled: true,
    i18Next: {
      interpolation: {
        escapeValue: false, // do not escape ssml tags
      },
      load: 'all',
      returnObjects: true,
    },
    selectOptions: {
      view: 'Grid view',
    },
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

  parse(handleRequest: HandleRequest, values: any[][]) {
    // tslint:disable-line
    const name = this.config.name;

    if (!name) {
      throw new JovoError(
        'name has to be set',
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-airtable',
        `The sheet's name has to be defined in your config.js file`,
        undefined,
        'https://v3.jovo.tech/docs/cms/airtable#configuration',
      );
    }

    /**
     * The 2-dimensional array might not have the same order as the airtable base, i.e.
     * the value at index 0 does not necessarily have to be from the 1st column.
     * The response sheet expects the `key` property (1st column) to be at index 0,
     * so we move it (1st dimension array), and all of its values (2nd dimension array)
     * to index 0 of each of their arrays.
     */
    this.moveValueToIndexX(values, 'key', 0);

    const headers: string[] = values[0];
    const platforms = handleRequest.app.getAppTypes();
    const resources: any = {}; // tslint:disable-line
    for (let i = 1; i < values.length; i++) {
      const row: string[] = values[i];
      for (let j = 1; j < headers.length; j++) {
        const cell: string = row[j];
        let locale: string = headers[j];
        let platform: string | undefined;

        const localeSplit: string[] = locale.split('-');

        // workaround for locales like en and en-US to work
        for (const p of platforms) {
          const indexOfPlatform = localeSplit.indexOf(p);
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

        let key = `${locale}.translation.${row[0]}`;
        if (platform) {
          key = `${locale}.${platform}.translation.${row[0]}`;
        }

        if (!cell) {
          continue;
        }

        const valueArray = _get(resources, key, []);
        let value = cell;
        if (cell === '/') {
          value = '';
        }
        valueArray.push(value);
        _set(resources, key, valueArray);
      }
    }

    if (!handleRequest.app.$cms.I18Next) {
      // @ts-ignore
      i18n.init(
        Object.assign(
          {
            // tslint:disable-line
            resources,
          },
          this.config.i18Next,
        ),
      );
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

    handleRequest.app.$cms[name] = resources;
  }

  /**
   * Moves `value` to `index` for every arr in the 2 dimensional `array`
   * @param {any[][]} array
   * @param {any} value
   * @param {string} index
   */
  moveValueToIndexX(array: any[][], value: any, index: number) {
    if (array.length < 1) {
      return;
    }

    const headers: string[] = array[0];
    const currentIndexOfKey = headers.indexOf(value);

    array.forEach((arr) => {
      // move value to desired index
      arr.splice(index, 0, arr[currentIndexOfKey]);
      // arr length was increased by 1, i.e. key shifted one to the right
      const newIndexOfKey = currentIndexOfKey + 1;
      // delete value from previous index
      arr.splice(newIndexOfKey, 1);
    });
  }
}
