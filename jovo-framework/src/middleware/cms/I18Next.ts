import {BaseApp, Jovo, Plugin, PluginConfig, HandleRequest, SpeechBuilder} from 'jovo-core';
import * as _ from "lodash";
import * as fs from "fs";
import * as util from 'util';
import * as path from 'path';
import * as i18n from 'i18next';


export interface Config extends PluginConfig {
    filesDir?: string;
    load?: string;
    returnObjects?: boolean;
    interpolation?: {
        escapeValue: boolean;
    };
    resources?: any; // tslint:disable-line
}

export class I18Next implements Plugin {
    config: Config = {
        filesDir: './i18n',
        load: 'all',
        returnObjects: true,
        interpolation: {
            escapeValue: false, // do not escape ssml tags
        },
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
        }
    }
    install(app: BaseApp): void {
        app.middleware('setup')!.use(this.loadFiles.bind(this));

        Jovo.prototype.t = function() {
            this.$app!.$cms.i18n.changeLanguage(this.getLocale());
            return this.$app!.$cms.i18n.t.apply(
                this.$app!.$cms.i18n, arguments
            );
        };

        SpeechBuilder.prototype.t = function() {
            this.jovo!.$app!.$cms.i18n.changeLanguage(this.jovo!.getLocale());
            const translatedText = this.jovo!.$app!.$cms.i18n.t.apply(
                this.jovo!.$app!.$cms.i18n, arguments
            );
            this.addText(translatedText);
            return this;
        };
        SpeechBuilder.prototype.addT = function() {
            this.jovo!.$app!.$cms.i18n.changeLanguage(this.jovo!.getLocale());
            const translatedText = this.jovo!.$app!.$cms.i18n.t.apply(
                this.jovo!.$app!.$cms.i18n, arguments
            );
            this.addText(translatedText);
            return this;
        };

    }
    uninstall(app: BaseApp) {

    }
    async loadFiles(handleRequest: HandleRequest) {
        const readdir = util.promisify(fs.readdir);
        handleRequest.app.$cms.resources = {};

        const filesDir = this.config.filesDir || '';

        if (fs.existsSync(filesDir)) {
            const dir = await readdir(filesDir);

            dir.forEach((file: string) => {
                const locale = file.substring(0, file.indexOf('.json'));

                handleRequest.app.$cms.resources[locale] = require(
                    path.join(
                        process.cwd(),
                        filesDir,
                        file));
            });
        } else if (this.config.resources) {
            handleRequest.app.$cms.resources = this.config.resources;
        }

        handleRequest.app.$cms.i18n = i18n
            .init(Object.assign(
                {
                    resources: handleRequest.app.$cms.resources
                },
                this.config));

    }
}
