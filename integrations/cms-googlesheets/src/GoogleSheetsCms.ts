import { App, Jovo, JovoError, Plugin, PluginConfig, RequiredOnlyWhere } from '@jovotech/framework';
import { JWT, JWTInput } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
import { GoogleSheetsCmsSheet } from './sheets/GoogleSheetsCmsSheet';

export interface GoogleSheetsCmsConfig extends PluginConfig {
  caching?: boolean;
  serviceAccount: JWTInput;
  spreadsheetId: string;
  sheets: Record<string, GoogleSheetsCmsSheet>;
}

export type GoogleSheetsCmsInitConfig = RequiredOnlyWhere<
  GoogleSheetsCmsConfig,
  'serviceAccount' | 'spreadsheetId'
>;

export class GoogleSheetsCms extends Plugin<GoogleSheetsCmsConfig> {
  private jwt?: JWT;

  constructor(config: GoogleSheetsCmsInitConfig) {
    super(config);
  }

  getDefaultConfig(): GoogleSheetsCmsConfig {
    return { ...this.getInitConfig(), sheets: {} };
  }

  getInitConfig(): GoogleSheetsCmsInitConfig {
    return { serviceAccount: {}, spreadsheetId: '<YOUR-SPREADSHEET-ID>' };
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

      const spreadsheetId = sheet.config.spreadsheetId || this.config.spreadsheetId;

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
        // TODO: Data can be undefined? => investigate, add check @rubenaeg
        const parsed = sheet.parse(response.data.values!, jovo);
        jovo.$cms[sheetName] = parsed;
      } catch (error) {
        throw new JovoError({ message: (error as Error).message });
      }
    }
  }

  private async initializeJWT(): Promise<JWT> {
    if (!this.config.serviceAccount) {
      throw new JovoError({
        message: 'serviceAccount has to bet set',
        learnMore: 'https://www.jovo.tech/docs/cms/google-sheets#configuration',
      });
    }

    try {
      const jwt: JWT = new JWT({
        email: this.config.serviceAccount.client_email as string,
        key: this.config.serviceAccount.private_key as string,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      await jwt.authorize();

      return jwt;
    } catch (error) {
      throw new JovoError({ message: (error as Error).message });
    }
  }
}
