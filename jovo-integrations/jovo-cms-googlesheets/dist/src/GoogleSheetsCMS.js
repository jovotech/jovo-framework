"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const googleapis_1 = require("googleapis");
const jovo_core_1 = require("jovo-core");
const path = require("path");
const _merge = require("lodash.merge");
const util = require("util");
const DefaultSheet_1 = require("./DefaultSheet");
const KeyObjectSheet_1 = require("./KeyObjectSheet");
const KeyValueSheet_1 = require("./KeyValueSheet");
const ObjectArraySheet_1 = require("./ObjectArraySheet");
const ResponsesSheet_1 = require("./ResponsesSheet");
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);
class GoogleSheetsCMS extends jovo_core_1.BaseCmsPlugin {
    constructor(config) {
        super(config);
        this.config = {
            access: 'private',
            caching: true,
            credentialsFile: './credentials.json',
            enabled: true,
            sheets: [],
            spreadsheetId: undefined,
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new jovo_core_1.ActionSet(['retrieve'], this);
    }
    install(app) {
        super.install(app);
        this.baseApp = app;
        app.middleware('setup').use(this.retrieveSpreadsheetData.bind(this));
        const defaultSheetMap = {
            default: DefaultSheet_1.DefaultSheet,
            keyobject: KeyObjectSheet_1.KeyObjectSheet,
            keyvalue: KeyValueSheet_1.KeyValueSheet,
            objectarray: ObjectArraySheet_1.ObjectArraySheet,
            responses: ResponsesSheet_1.ResponsesSheet,
        };
        if (process.env.JEST_WORKER_ID &&
            this.config.credentialsFile &&
            !path.isAbsolute(this.config.credentialsFile)) {
            this.config.credentialsFile = path.join('./src', this.config.credentialsFile);
        }
        if (this.config.sheets) {
            this.config.sheets.forEach((sheet) => {
                let type;
                if (!sheet.type) {
                    type = 'Default';
                }
                if (sheet.type && defaultSheetMap[sheet.type.toLowerCase()]) {
                    type = sheet.type.toLowerCase();
                }
                if (type) {
                    this.use(new defaultSheetMap[type.toLowerCase()](sheet));
                }
            });
        }
    }
    async loadPublicSpreadsheetData(spreadsheetId, sheetPosition = 1) {
        const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/${sheetPosition}/public/values?alt=json`;
        jovo_core_1.Log.verbose('Accessing public spreadsheet: ' + url);
        const response = await jovo_core_1.HttpService.get(url, {
            validateStatus: (status) => {
                return status < 500;
            },
        });
        if (response.status === 302) {
            throw new jovo_core_1.JovoError('HTTP Response code 302', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-spreadsheets', undefined, 'This might occur when you try to access a private spreadsheet without the permission.');
        }
        if (response.status === 400) {
            throw new jovo_core_1.JovoError('HTTP Response code 400', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-spreadsheets', undefined, 'This might occur when you use the wrong spreadsheet id.');
        }
        return response.data;
    }
    loadPrivateSpreadsheetData(spreadsheetId, sheet, range) {
        // tslint:disable-line
        return new Promise((resolve, reject) => {
            try {
                const sheets = googleapis_1.google.sheets('v4');
                sheets.spreadsheets.values.get({
                    auth: this.jwtClient,
                    range: `${sheet}!${range}`,
                    spreadsheetId,
                }, (error, response) => {
                    // tslint:disable-line
                    if (error) {
                        return reject(error);
                    }
                    resolve(response.data.values);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async retrieveSpreadsheetData(handleRequest) {
        try {
            if (this.config.credentialsFile) {
                const credentialsFileExists = await exists(this.config.credentialsFile);
                if (credentialsFileExists) {
                    this.jwtClient = await this.initializeJWT();
                    this.jwtClient = await this.authorizeJWT(this.jwtClient);
                }
            }
            await this.middleware('retrieve').run(handleRequest, true);
        }
        catch (e) {
            if (e.constructor.name === 'JovoError') {
                throw e;
            }
            throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', undefined, undefined, 'https://www.jovo.tech/docs/cms/google-sheets');
        }
    }
    initializeJWT() {
        // tslint:disable-line
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.config.credentialsFile) {
                    return reject(new Error('Credentials file is mandatory'));
                }
                const credentialsFileExists = await exists(this.config.credentialsFile);
                if (!credentialsFileExists) {
                    return reject(new Error(`Credentials file doesn't exist`));
                }
                const results = await readFile(this.config.credentialsFile);
                const keyFileObject = JSON.parse(results.toString());
                const jwtClient = new googleapis_1.google.auth.JWT(keyFileObject.client_email, undefined, keyFileObject.private_key, ['https://www.googleapis.com/auth/spreadsheets'], undefined);
                resolve(jwtClient);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    authorizeJWT(jwtClient) {
        // tslint:disable-line
        return new Promise((resolve, reject) => {
            try {
                jwtClient.authorize((errorJwt) => {
                    if (errorJwt) {
                        return reject(errorJwt);
                    }
                    resolve(jwtClient);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.GoogleSheetsCMS = GoogleSheetsCMS;
//# sourceMappingURL=GoogleSheetsCMS.js.map