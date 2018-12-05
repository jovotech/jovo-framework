import {Plugin, Extensible, PluginConfig, HandleRequest, Jovo, Cms} from 'jovo-core';
import * as i18n from 'i18next';
import * as _ from "lodash";
import {Config as DefaultSheetConfig, DefaultSheet} from "./DefaultSheet";

export interface Config extends DefaultSheetConfig {
}

export interface Config extends PluginConfig {
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
            this.config = _.merge(this.config, config);
        }
    }

    install(extensible: Extensible) {
       super.install(extensible);
        Cms.prototype.t = function() {
            if (!this.$jovo) {
                return;
            }
            this.$jovo.$app!.$cms.i18Next.changeLanguage( this.$jovo.getLocale());
            return this.$jovo.$app!.$cms.i18Next.t.apply(
                this.$jovo.$app!.$cms.i18Next, arguments
            );
        };

    }

    parse(handleRequest: HandleRequest, values: any[]) {  // tslint:disable-line

        const headers: string[] = values[0];
        const resources = {};

        for (let i = 1; i < values.length; i++) {
            const row: string[] = values[i];
            for (let j = 1; j < row.length; j++) {
                const cell: string = row[j];
                const locale: string = headers[j];
                _.set(resources, `${locale}.translation.${row[0]}`, cell);
            }
        }
        const entity = this.config.entity || this.config.name;

        if (!entity) {
            throw new Error('Entity has to be set.');
        }
        handleRequest.app.$cms.i18Next = i18n.init(
            Object.assign({
                    resources
                },
                    this.config.i18Next
            ));

        handleRequest.app.$cms[entity] = resources;

    }
}
