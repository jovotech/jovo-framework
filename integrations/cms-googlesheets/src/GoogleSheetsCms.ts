import { App, Jovo, JovoError, Plugin, PluginConfig } from '@jovotech/framework';
import { Credentials } from './interfaces';
import path from 'path';
import { existsSync, readFileSync } from 'fs';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { GoogleSheetsCmsSheet } from './sheets/GoogleSheetsCmsSheet';

export interface GoogleSheetsCmsConfig extends PluginConfig {
  caching?: boolean;
  credentialsFile: string;
  spreadsheetId?: string;
  sheets: Record<string, GoogleSheetsCmsSheet>;
}

export class GoogleSheetsCms extends Plugin<GoogleSheetsCmsConfig> {
  getDefaultConfig(): GoogleSheetsCmsConfig {
    return { credentialsFile: '', sheets: {} };
  }

  install(app: App): void {
    // If in a unit test, we need to resolve the correct path to the credentials file
    if (
      process.env.JEST_WORKER_ID &&
      this.config.credentialsFile &&
      !path.isAbsolute(this.config.credentialsFile)
    ) {
      this.config.credentialsFile = path.join('./src', this.config.credentialsFile);
    }

    app.middlewareCollection.use('request.start', this.retrieveSpreadsheetData.bind(this));
  }

  async retrieveSpreadsheetData(jovo: Jovo): Promise<void> {
    const jwt: JWT = await this.initializeJWT();

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
          message: 'spreadsheetId has to be set.',
          hint: 'The spreadsheetId has to be defined in your config.js file',
          learnMore: 'https://www.jovo.tech/docs/cms/google-sheets#configuration',
        });
      }

      if (!sheet.config.range) {
        throw new JovoError({ message: 'range has to bet set' });
      }

      try {
        const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: jwt });
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
      throw new JovoError({ message: 'Credentials are mandatory, please provide them' });
    }

    if (!existsSync(this.config.credentialsFile)) {
      throw new JovoError({ message: "Couldn't find credentials file" });
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
