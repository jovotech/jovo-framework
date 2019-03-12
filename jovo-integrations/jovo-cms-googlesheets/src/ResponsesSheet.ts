import { Extensible, HandleRequest, Cms } from 'jovo-core';
const i18n = require('i18next');

import _merge = require('lodash.merge');
import _set = require('lodash.set');
import _get = require('lodash.get');

import { DefaultSheet, GoogleSheetsSheet } from "./DefaultSheet";


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
        range: 'A:Z',
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
        const platforms = ['AlexaSkill', 'GoogleAction'];
        const resources: any = {}; // tslint:disable-line
        for (let i = 1; i < values.length; i++) {
            const row: string[] = values[i];
            for (let j = 1; j < headers.length; j++) {
                const cell: string = row[j];
                let locale: string = headers[j];
                let platform: string | undefined;

                const localeSplit: string[] = locale.split('-');

                if (localeSplit.length >= 2) {
                    locale = `${localeSplit[0]}-${localeSplit[1].toUpperCase()}`;
                    if (localeSplit.length === 3) {
                        for (const p of platforms) {
                            if (localeSplit[2] === p.toLowerCase()) {
                                platform = p;
                                this.cms!.baseApp.config.platformSpecificResponses = true;
                            }
                        }
                    }
                }

                // match locale
                // thx to https://stackoverflow.com/a/48300605/10204142
                if (!locale.match(/^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[0-9]{3}))?([_-]([A-Za-z]{2}|[0-9]{3}))?$/)) {
                    continue;
                }

                let key = `${locale}.translation.${row[0]}`;
                if (platform) {
                    if (!cell || cell === '') {
                        continue;
                    }
                    key = `${locale}.${platform}.translation.${row[0]}`;
                }

                const valueArray = _get(resources, key, []);
                valueArray.push(cell);

                _set(resources, key, valueArray);
            }
        }
        const entity = this.config.entity || this.config.name;

        if (!entity) {
            throw new Error('Entity has to be set.');
        }
        if (!handleRequest.app.$cms.I18Next) {
            i18n.init(Object.assign(
                { resources }, this.config.i18Next
            ));
            handleRequest.app.$cms.I18Next = { i18n };
        } else {
            Object.keys(resources).forEach((localeKey) => {
                const resource = resources[localeKey];
                for (const platform of platforms) {
                    if (resource[platform]) {
                        handleRequest.app.$cms.I18Next.i18n.addResourceBundle(localeKey, platform, resource[platform]);
                    }
                }

                handleRequest.app.$cms.I18Next.i18n.addResourceBundle(localeKey, 'translation', resource.translation);
            });
        }

        handleRequest.app.$cms[entity] = resources;

    }
}
