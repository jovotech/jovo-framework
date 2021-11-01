import { App, Jovo, JovoError, Plugin, PluginConfig } from '@jovotech/framework';
import { existsSync, readFileSync } from 'fs';
import { JWT } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
import { Credentials } from './interfaces';
import { GoogleSheetsCmsSheet } from './sheets/GoogleSheetsCmsSheet';

export interface GoogleSheetsCmsConfig extends PluginConfig {
  caching?: boolean;
  credentialsFile: string;
  spreadsheetId?: string;
  sheets: Record<string, GoogleSheetsCmsSheet>;
}

export class GoogleSheetsCms extends Plugin<GoogleSheetsCmsConfig> {
  private jwt?: JWT;

  getDefaultConfig(): GoogleSheetsCmsConfig {
    return { credentialsFile: '', sheets: {} };
  }

  install(app: App): void {
    app.middlewareCollection.use('request.start', this.retrieveSpreadsheetData.bind(this));
  }

  async initialize(): Promise<void> {
    this.jwt = await this.initializeJWT();
  }

  async retrieveSpreadsheetData(jovo: Jovo): Promise<void> {
    for (const [sheetName, sheet] of Object.entries(this.config.sheets)) {
      // Cache cms data, if not configured otherwise
      if (
        (this.config.caching !== false || sheet.config.caching !== false) &&
        jovo.$cms[sheetName]
      ) {
        continue;
      }

      const spreadsheetId = this.config.spreadsheetId || sheet.config.spreadsheetId;

      if (!spreadsheetId) {
        throw new JovoError({
          message: `spreadsheetId has to be set for ${sheetName}`,
          learnMore: 'https://www.jovo.tech/docs/cms/google-sheets#configuration',
        });
      }

      if (!sheet.config.range) {
        throw new JovoError({
          message: `range has to be set for ${sheetName}`,
          learnMore: 'https://www.jovo.tech/docs/cms/google-sheets#configuration',
        });
      }

      try {
        const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: this.jwt });
        const response = await sheets.spreadsheets.values.get({
          range: `${sheetName}!${sheet.config.range}`,
          spreadsheetId,
        });
        // TODO: Data can be undefined?
        const parsed = sheet.parse(jovo, response.data.values!);
        jovo.$cms[sheetName] = parsed;
      } catch (error) {
        throw new JovoError({ message: error.message });
      }
    }
  }

  private async initializeJWT(): Promise<JWT> {
    if (!this.config.credentialsFile) {
      throw new JovoError({
        message: 'credentialsFile has to bet set',
        learnMore: 'https://www.jovo.tech/docs/cms/google-sheets#configuration',
      });
    }

    if (!existsSync(this.config.credentialsFile)) {
      throw new JovoError({
        message: `Couldn\'t read credentials file from ${this.config.credentialsFile}`,
      });
    }

    try {
      const credentials: Credentials = JSON.parse(
        readFileSync(this.config.credentialsFile, 'utf-8'),
      );

      const jwt: JWT = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      await jwt.authorize();

      return jwt;
    } catch (error) {
      throw new JovoError({ message: error.message });
    }
  }
}
