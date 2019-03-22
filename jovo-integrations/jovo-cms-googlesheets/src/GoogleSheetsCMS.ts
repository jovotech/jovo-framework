import {JovoError, ErrorCode, BaseCmsPlugin, BaseApp, ActionSet, HandleRequest, ExtensibleConfig, Log} from 'jovo-core';
import _merge = require('lodash.merge');
const {google, JWT} = require('googleapis');
import * as util from 'util';
import * as https from 'https';

import * as fs from 'fs';
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);
import {KeyValueSheet} from "./KeyValueSheet";
import {ResponsesSheet} from "./ResponsesSheet";
import {DefaultSheet, GoogleSheetsSheet} from "./DefaultSheet";
import {ObjectArraySheet} from "./ObjectArraySheet";



export interface Config extends ExtensibleConfig {
    credentialsFile?: string;
    spreadsheetId?: string;
    sheets?: GoogleSheetsSheet[];
    access?: string;
    caching?: boolean;
}

export class GoogleSheetsCMS extends BaseCmsPlugin {
    config: Config = {
        enabled: true,
        credentialsFile: './credentials.json',
        spreadsheetId: undefined,
        access: 'private',
        sheets: [],
        caching: true
    };
    jwtClient: any; // tslint:disable-line
    baseApp: any;   // tslint:disable-line

    constructor(config?: Config) {
        super(config);

        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new ActionSet([
            'retrieve',
        ], this);

    }

    async install(app: BaseApp) {
        super.install(app);
        this.baseApp = app;
        app.middleware('setup')!.use(this.retrieveSpreadsheetData.bind(this));

        const defaultSheetMap: {[key: string]: any}= { // tslint:disable-line
            'keyvalue': KeyValueSheet,
            'responses': ResponsesSheet,
            'objectarray': ObjectArraySheet,
            'default': DefaultSheet
        };

        if ( this.config.sheets) {
            this.config.sheets.forEach((sheet: GoogleSheetsSheet) => {
                let type = undefined;
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

    uninstall(app: BaseApp) {
    }

    private async retrieveSpreadsheetData(handleRequest: HandleRequest) {

        try {
            if (this.config.credentialsFile) {
                const credentialsFileExists = await exists(this.config.credentialsFile);

                if (credentialsFileExists) {
                    this.jwtClient = await this.initializeJWT();
                    this.jwtClient = await this.authorizeJWT(this.jwtClient );
                }
            }

            await this.middleware('retrieve')!.run(handleRequest, true);

        } catch (e) {
            if (e.constructor.name === 'JovoError') {
                throw e;
            }
            throw new JovoError(e.message, ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', undefined, undefined, 'https://www.jovo.tech/docs/cms/google-sheets');
        }
    }

    async loadPublicSpreadSheetData (spreadsheetId: string, sheetPosition = 1) {
        const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/${sheetPosition}/public/values?alt=json`;
        Log.verbose('Accessing public spreadsheet: ' + url);
        return await this.getJSON(url);
    }

    loadPrivateSpreadsheetData (spreadsheetId: string, sheet: string, range: string): Promise<any[]> { // tslint:disable-line
        return new Promise(
            (resolve, reject) => {
                try {
                    const sheets = google.sheets('v4');
                    sheets.spreadsheets.values.get(
                        {
                            auth: this.jwtClient,
                            spreadsheetId,
                            range: `${sheet}!${range}`,
                        }, (error: Error, response: any) => { // tslint:disable-line
                            if (error) {
                                return reject(error);
                            }
                            resolve(response.data.values);
                        }
                    );
                } catch (error) {
                    reject(error);
                }
            }
        );
    }


    private initializeJWT(): Promise<any> { // tslint:disable-line
        return new Promise(
            async (resolve, reject) => {
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

                    const jwtClient = new google.auth.JWT(
                        keyFileObject.client_email,
                        null,
                        keyFileObject.private_key,
                        ['https://www.googleapis.com/auth/spreadsheets'],
                        null
                    );
                    resolve(jwtClient);
                } catch (error) {
                    reject(error);
                }
            }
        );
    }

    private authorizeJWT(jwtClient: any) { // tslint:disable-line
        return new Promise(
            (resolve, reject) => {
                try {
                    jwtClient.authorize(
                        (errorJwt: Error) => {
                            if (errorJwt) {
                                return reject(errorJwt);
                            }
                            resolve(jwtClient);
                        }
                    );
                } catch (error) {
                    reject(error);
                }
            }
        );
    }

    private getJSON(url: string) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode === 302) {
                            return reject(new JovoError(
                                'HTTP Response code 302',
                                ErrorCode.ERR_PLUGIN,
                                'jovo-cms-spreadsheets',
                                undefined,
                                "This might occur when you try to access a private spreadsheet without the permission."
                                ));
                        }

                        if (res.statusCode === 400) {
                            return reject(new JovoError(
                                'HTTP Response code 400',
                                ErrorCode.ERR_PLUGIN,
                                'jovo-cms-spreadsheets',
                                undefined,
                                "This might occur when you use the wrong spreadsheet id."
                            ));
                        }
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', (e) => {
                reject(e);
            });
        });
    }

}
