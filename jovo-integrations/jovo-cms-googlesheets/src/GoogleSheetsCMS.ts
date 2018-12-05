import {BaseCmsPlugin, BaseApp, ActionSet, HandleRequest, ExtensibleConfig} from 'jovo-core';
import * as _ from "lodash";
const {google, JWT} = require('googleapis');
import * as util from 'util';
import * as fs from 'fs';
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);
import {KeyValueSheet} from "./KeyValueSheet";
import {ResponsesSheet} from "./ResponsesSheet";
import {DefaultSheet} from "./DefaultSheet";


export interface GoogleSheetsSheet {
    name: string;
    spreadsheetId?: string;
    type?: string;
}

export interface Config extends ExtensibleConfig {
    credentialsFile?: string;
    spreadsheetId?: string;
    sheets?: GoogleSheetsSheet[];
}

export class GoogleSheetsCMS extends BaseCmsPlugin {
    config: Config = {
        enabled: true,
        credentialsFile: './credentials.json',
        spreadsheetId: undefined,
        sheets: [],
    };
    jwtClient: any; // tslint:disable-line

    constructor(config?: Config) {
        super(config);

        if (config) {
            this.config = _.merge(this.config, config);
        }
        this.actionSet = new ActionSet([
            'retrieve',
        ], this);

    }

    async install(app: BaseApp) {
        super.install(app);
        app.middleware('setup')!.use(this.retrieveSpreadsheetData.bind(this));

        const defaultSheetMap: {[key: string]: any}= { // tslint:disable-line
            'KeyValue': KeyValueSheet,
            'Responses': ResponsesSheet,
            'Default': DefaultSheet
        };

        if ( this.config.sheets) {
            this.config.sheets.forEach((sheet: GoogleSheetsSheet) => {
                let type = undefined;
                if (!sheet.type) {
                    type = 'DefaultSheet';
                }
                if (sheet.type && defaultSheetMap[sheet.type]) {
                    type = sheet.type;
                }
                if (type) {
                    this.use(new defaultSheetMap[type](sheet));
                }
            });
        }
    }

    uninstall(app: BaseApp) {
    }

    private async retrieveSpreadsheetData(handleRequest: HandleRequest) {
        try {
            this.jwtClient = await this.initializeJWT();
            this.jwtClient = await this.authorizeJWT(this.jwtClient );
            await this.middleware('retrieve')!.run(handleRequest, true);

        } catch (e) {
                console.log(e);
        }
    }

    loadSpreadsheetData (spreadsheetId: string, sheet: string, range: string): Promise<any[]> { // tslint:disable-line
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

}
