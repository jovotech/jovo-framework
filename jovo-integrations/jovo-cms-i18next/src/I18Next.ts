import {Cms, BaseCmsPlugin, BaseApp, Jovo, PluginConfig, HandleRequest, SpeechBuilder, Log} from 'jovo-core';
import _merge = require('lodash.merge');
import * as fs from "fs";
import * as util from 'util';
import * as path from 'path';
const i18n = require('i18next');


export interface Config extends PluginConfig {
    filesDir?: string;
    load?: string;
    returnObjects?: boolean;
    interpolation?: {
        escapeValue: boolean;
    };
    resources?: any; // tslint:disable-line
}

export class I18Next extends BaseCmsPlugin {
    config: Config = {
        filesDir: './i18n',
        load: 'all',
        returnObjects: true,
        interpolation: {
            escapeValue: false, // do not escape ssml tags
        },
        resources: undefined,
    };

    constructor(config?: Config) {
        super(config);
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app: BaseApp): void {
        super.install(app);
        app.middleware('setup')!.use(this.loadFiles.bind(this));

        Jovo.prototype.t = function() {
            this.$app!.$cms.I18Next.i18n.changeLanguage(this.$request!.getLocale());
            return this.$app!.$cms.I18Next.i18n.t.apply(
                this.$app!.$cms.I18Next.i18n, arguments
            );
        };

        SpeechBuilder.prototype.t = function() {
            this.jovo!.$app!.$cms.I18Next.i18n.changeLanguage(this.jovo!.$request!.getLocale());
            const translatedText = this.jovo!.$app!.$cms.I18Next.i18n.t.apply(
                this.jovo!.$app!.$cms.I18Next.i18n, arguments
            );
            this.addText(translatedText);
            return this;
        };
        SpeechBuilder.prototype.addT = function() {
            this.jovo!.$app!.$cms.I18Next.i18n.changeLanguage(this.jovo!.$request!.getLocale());
            const translatedText = this.jovo!.$app!.$cms.I18Next.i18n.t.apply(
                this.jovo!.$app!.$cms.I18Next.i18n, arguments
            );
            this.addText(translatedText);
            return this;
        };

        Cms.prototype.t = function() {
            if (!this.$jovo) {
                return;
            }
            this.$jovo.$app!.$cms.I18Next.i18n.changeLanguage( this.$jovo.$request!.getLocale());
            return this.$jovo.$app!.$cms.I18Next.i18n.t.apply(
                this.$jovo.$app!.$cms.I18Next.i18n, arguments
            );
        };


    }
    async loadFiles(handleRequest: HandleRequest) {
        const readdir = util.promisify(fs.readdir);
        handleRequest.app.$cms.I18Next = {};
        handleRequest.app.$cms.I18Next.resources = {};

        const filesDir = this.config.filesDir || '';

        if (fs.existsSync(filesDir)) {
            const dir = await readdir(filesDir);

            Log.verbose(`Iterating i18n folder: ${filesDir}`);

            dir.forEach((file: string) => {
                const ext = file.split('.')[1];
                const validExtensions = ['js', 'json'];
                if (validExtensions.includes(ext)) {
                    const locale = file.split('.')[0];
                    Log.verbose(`- ${file}`);

                    handleRequest.app.$cms.I18Next.resources[locale] = require(
                        path.join(
                            process.cwd(),
                            filesDir,
                            file));
                }
            });
        } else if (this.config.resources) {
            handleRequest.app.$cms.I18Next.resources = this.config.resources;
        }

        Log.debug(`Adding resources to $cms object:`);
        Log.debug(JSON.stringify(handleRequest.app.$cms.I18Next.resources, null, '\t'));
        i18n
            .init(_merge(
                {
                    resources: handleRequest.app.$cms.I18Next.resources
                },
                this.config));
        handleRequest.app.$cms.I18Next.i18n = i18n;

    }
}
