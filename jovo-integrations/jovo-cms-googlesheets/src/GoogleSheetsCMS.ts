import * as fs from 'fs';
import { google} from 'googleapis';
import * as https from 'https';
import {
ActionSet,
BaseApp,
BaseCmsPlugin,
ErrorCode,
ExtensibleConfig,
HandleRequest,
JovoError,
Log
} from 'jovo-core';
import _merge = require('lodash.merge');
import * as path from 'path';

import * as util from 'util';


const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);
import { DefaultSheet, GoogleSheetsSheet } from './DefaultSheet';
import { KeyValueSheet } from './KeyValueSheet';
import { ObjectArraySheet } from './ObjectArraySheet';
import { ResponsesSheet } from './ResponsesSheet';

export interface Config extends ExtensibleConfig {
	credentialsFile?: string;
	spreadsheetId?: string;
	sheets?: GoogleSheetsSheet[];
	access?: string;
	caching?: boolean;
}

export class GoogleSheetsCMS extends BaseCmsPlugin {
	config: Config = {
        access: 'private',
        caching: true,
        credentialsFile: './credentials.json',
        enabled: true,
        sheets: [],
        spreadsheetId: undefined
    };
	jwtClient: any; // tslint:disable-line
	baseApp: any; // tslint:disable-line

	constructor(config?: Config) {
		super(config);

		if (config) {
			this.config = _merge(this.config, config);
		}
		this.actionSet = new ActionSet(['retrieve'], this);
	}

	async install(app: BaseApp) {
		super.install(app);
		this.baseApp = app;
		app.middleware('setup')!.use(this.retrieveSpreadsheetData.bind(this));

		const defaultSheetMap: { [key: string]: any } = {
            default: DefaultSheet,
            keyvalue: KeyValueSheet,
            objectarray: ObjectArraySheet,
            responses: ResponsesSheet
		};

        if (process.env.JEST_WORKER_ID && this.config.credentialsFile && !path.isAbsolute(this.config.credentialsFile)) {
            this.config.credentialsFile = path.join('./src', this.config.credentialsFile);
        }

		if (this.config.sheets) {
			this.config.sheets.forEach((sheet: GoogleSheetsSheet) => {
				let type;
				if (!sheet.type) {
					type = 'Default';
				}
				if (sheet.type && defaultSheetMap[sheet.type.toLowerCase()]) {
					type = sheet.type.toLowerCase();
				}
				if (type) {
					this.use(new defaultSheetMap[(type.toLowerCase())](sheet));
				}
			});
		}
	}



	async loadPublicSpreadsheetData(spreadsheetId: string, sheetPosition = 1) {
		const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/${sheetPosition}/public/values?alt=json`;
		Log.verbose('Accessing public spreadsheet: ' + url);
		return this.getJSON(url);
	}

	loadPrivateSpreadsheetData(
		spreadsheetId: string,
		sheet: string,
		range: string
	): Promise<any[]> {
		// tslint:disable-line
		return new Promise((resolve, reject) => {
			try {
				const sheets = google.sheets('v4');
				sheets.spreadsheets.values.get(
					{
						auth: this.jwtClient,
                        range: `${sheet}!${range}`,
                        spreadsheetId
					},
					(error: Error | null, response: any) => {
						// tslint:disable-line
						if (error) {
							return reject(error);
						}
						resolve(response.data.values);
					}
				);
			} catch (error) {
				reject(error);
			}
		});
	}

    private async retrieveSpreadsheetData(handleRequest: HandleRequest) {
        try {
            if (this.config.credentialsFile) {
                const credentialsFileExists = await exists(this.config.credentialsFile);

                if (credentialsFileExists) {
                    this.jwtClient = await this.initializeJWT();
                    this.jwtClient = await this.authorizeJWT(this.jwtClient);
                }
            }

            await this.middleware('retrieve')!.run(handleRequest, true);
        } catch (e) {
            if (e.constructor.name === 'JovoError') {
                throw e;
            }
            throw new JovoError(
                e.message,
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-googlesheets',
                undefined,
                undefined,
                'https://www.jovo.tech/docs/cms/google-sheets'
            );
        }
    }
	private initializeJWT(): Promise<any> {
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

				const jwtClient = new google.auth.JWT(
					keyFileObject.client_email,
					undefined,
					keyFileObject.private_key,
					['https://www.googleapis.com/auth/spreadsheets'],
                    undefined
				);
				resolve(jwtClient);
			} catch (error) {
				reject(error);
			}
		});
	}

	private authorizeJWT(jwtClient: any) {
		// tslint:disable-line
		return new Promise((resolve, reject) => {
			try {
				jwtClient.authorize((errorJwt: Error) => {
					if (errorJwt) {
						return reject(errorJwt);
					}
					resolve(jwtClient);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	private getJSON(url: string) {
		return new Promise((resolve, reject) => {
			https
				.get(url, res => {
					let body = '';

					res.on('data', chunk => {
						body += chunk;
					});

					res.on('end', () => {
						try {
							if (res.statusCode === 302) {
								return reject(
									new JovoError(
										'HTTP Response code 302',
										ErrorCode.ERR_PLUGIN,
										'jovo-cms-spreadsheets',
										undefined,
										'This might occur when you try to access a private spreadsheet without the permission.'
									)
								);
							}

							if (res.statusCode === 400) {
								return reject(
									new JovoError(
										'HTTP Response code 400',
										ErrorCode.ERR_PLUGIN,
										'jovo-cms-spreadsheets',
										undefined,
										'This might occur when you use the wrong spreadsheet id.'
									)
								);
							}
							resolve(JSON.parse(body));
						} catch (e) {
							reject(e);
						}
					});
				})
				.on('error', e => {
					reject(e);
				});
		});
	}
}
