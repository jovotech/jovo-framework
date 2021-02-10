"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const jovo_core_1 = require("jovo-core");
const jovo_model_nlpjs_1 = require("jovo-model-nlpjs");
const path = require("path");
const _merge = require("lodash.merge");
const { Nlp } = require('@nlpjs/nlp');
const { Ner } = require('@nlpjs/ner');
class NlpjsNlu {
    constructor(config) {
        this.config = {
            languages: ['en'],
            preTrainedModelFilePath: './model.nlp',
            useModel: false,
            modelsPath: jovo_core_1.Project.getModelsPath(),
            setupModelCallback: undefined,
        };
        this.config = _merge(this.config, config || {});
    }
    get name() {
        return this.constructor.name;
    }
    install(parent) {
        if (!(parent instanceof jovo_core_1.Platform)) {
            throw new jovo_core_1.JovoError(`'${this.name}' has to be an immediate plugin of a platform!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        parent.middleware('setup').use(this.setup.bind(this));
        parent.middleware('$nlu').use(this.nlu.bind(this));
        parent.middleware('$inputs').use(this.inputs.bind(this));
    }
    async setup(handleRequest) {
        const settings = {
            languages: this.config.languages || [],
        };
        this.nlp = new Nlp(Object.assign(Object.assign({}, settings), { autoLoad: this.config.useModel, autoSave: handleRequest.host.hasWriteFileAccess && this.config.useModel, modelFileName: this.config.preTrainedModelFilePath, nlu: { log: false } }));
        this.nlp.container.register('ner', new Ner(settings));
        if (handleRequest.host.hasWriteFileAccess) {
            this.nlp.container.register('fs', fs_1.promises);
        }
        if (this.config.setupModelCallback) {
            await this.config.setupModelCallback(handleRequest, this.nlp);
        }
        else if (this.config.useModel) {
            await this.nlp.load(this.config.preTrainedModelFilePath);
        }
        else {
            await this.addCorpus(this.config.modelsPath);
            await this.nlp.train();
        }
    }
    async nlu(jovo) {
        const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();
        const language = jovo.$request.getLocale().substr(0, 2);
        let response = null;
        if (text) {
            response = await this.nlp.process(language, text);
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No text input to process.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        let intentName = 'None';
        if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        else if (response && response.intent) {
            intentName = response.intent;
        }
        jovo.$nlu = {
            intent: {
                name: intentName,
            },
            [this.name]: response,
        };
    }
    async inputs(jovo) {
        if ((!jovo.$nlu || !jovo.$nlu[this.name]) && jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No nlu data to get inputs off was given.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH ||
            jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            jovo.$inputs = {};
            return;
        }
        const response = jovo.$nlu[this.name];
        const inputs = {};
        const entities = response.entities;
        if (!entities) {
            return inputs;
        }
        entities.forEach((entity) => {
            inputs[entity.entity] = {
                key: entity.option,
                name: entity.option,
                value: entity.sourceText,
            };
        });
        jovo.$inputs = inputs;
    }
    async train() {
        this.nlp = new Nlp({ languages: this.config.languages || [] });
        this.nlp.container.register('fs', fs_1.promises);
        await this.addCorpus(this.config.modelsPath);
        await this.nlp.train();
        await this.nlp.load(this.config.preTrainedModelFilePath);
    }
    addCorpus(dir) {
        return new Promise((resolve, reject) => {
            fs_1.readdir(dir, (err, files) => {
                if (err) {
                    return reject(err);
                }
                const jovoModelInstance = new jovo_model_nlpjs_1.JovoModelNlpjs();
                files.forEach((file) => {
                    const extension = file.substr(file.lastIndexOf('.') + 1);
                    const locale = file.substr(0, file.lastIndexOf('.'));
                    let jovoModelData;
                    if (extension === 'js') {
                        jovoModelData = require(path.join(this.config.modelsPath, file));
                    }
                    else if (extension === 'json') {
                        jovoModelData = JSON.parse(fs_1.readFileSync(path.join(this.config.modelsPath, file), 'utf-8'));
                    }
                    jovoModelInstance.importJovoModel(jovoModelData, locale);
                    const nlpjsModelFiles = jovoModelInstance.exportNative() || [];
                    nlpjsModelFiles.forEach((model) => {
                        this.nlp.addCorpus(model.content);
                    });
                });
                resolve();
            });
        });
    }
}
exports.NlpjsNlu = NlpjsNlu;
//# sourceMappingURL=NlpjsNlu.js.map