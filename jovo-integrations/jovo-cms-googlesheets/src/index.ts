export { GoogleSheetsCMS, Config } from './GoogleSheetsCMS';
export { KeyValueSheet } from './KeyValueSheet';
export { DefaultSheet } from './DefaultSheet';
export { ResponsesSheet } from './ResponsesSheet';
export { ObjectArraySheet } from './ObjectArraySheet';
export { KeyObjectSheet } from './KeyObjectSheet';

import { Config } from './GoogleSheetsCMS';

interface AppGoogleSheetsCMSConfig {
  GoogleSheetsCMS?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Cms {
    t(): string | string[] | object | object[];

    i18Next: any; // tslint:disable-line
  }

  export interface AppCmsConfig extends AppGoogleSheetsCMSConfig {}
  export interface ExtensiblePluginConfigs extends AppGoogleSheetsCMSConfig {}
}
