import {Extensible, HandleRequest, Cms, ErrorCode, JovoError} from 'jovo-core';
import { AirtableTable, DefaultTable } from "./DefaultTable";

const i18n = require('i18next');

import _merge = require('lodash.merge');
import _set = require('lodash.set');
import _get = require('lodash.get');

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
        selectOptions: {
            view: 'Grid view'
        },
        i18Next: {
            load: 'all',
            returnObjects: true,
            interpolation: {
                escapeValue: false, // do not escape ssml tags
            },
        }
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
            this.$jovo.$app!.$cms.I18Next.i18n.changeLanguage(this.$jovo.$request!.getLocale());
            return this.$jovo.$app!.$cms.I18Next.i18n.t.apply(
                this.$jovo.$app!.$cms.I18Next.i18n, arguments
            );
        };
    }

    parse(handleRequest: HandleRequest, values: any[]) {  // tslint:disable-line        
        const headers: string[] = values[0];
        const resources:any = {}; // tslint:disable-line
        for (let i = 1; i < values.length; i++) {
            const row: string[] = values[i];
            for (let j = 1; j < headers.length; j++) {
                const cell: string = row[j];
                let locale: string = headers[j];

                // workaround
                if (locale.length === 5) {
                    locale = locale.substr(0, 2) + '-' + locale.substr(3).toUpperCase();
                }

                // match locale
                // thx to https://stackoverflow.com/a/48300605/10204142
                if (!locale.match(/^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[0-9]{3}))?([_-]([A-Za-z]{2}|[0-9]{3}))?$/)) {
                    continue;
                }

                const valueArray = _get(resources, `${locale}.translation.${row[0]}`, []);
                valueArray.push(cell);

                _set(resources, `${locale}.translation.${row[0]}`, valueArray);
            }
        }        

        if (!this.config.name) {
            throw new JovoError(
                'name has to be set',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'The sheet\'s name has to be defined in your config.js file',
                undefined,
                'https://www.jovo.tech/docs/cms/airtable#configuration'
            );
        }
        if (!handleRequest.app.$cms.I18Next) {
            i18n.init(Object.assign({
                resources
            }, this.config.i18Next));
            handleRequest.app.$cms.I18Next.i18n = i18n;
        } else {
            Object.keys(resources).forEach((localeKey) => {
                const resource = resources[localeKey];
                Object.keys(resource.translation).forEach((key) => {
                    handleRequest.app.$cms.I18Next.i18n.addResource(localeKey, 'translation', key, resource.translation[key]);
                });
            });
        }

        handleRequest.app.$cms[this.config.name!] = resources;
    }
}