export { GoogleSheetsCMS, Config } from './GoogleSheetsCMS';
export { KeyValueSheet } from './KeyValueSheet';
export { DefaultSheet } from './DefaultSheet';
export { ResponsesSheet } from './ResponsesSheet';
export { ObjectArraySheet } from './ObjectArraySheet';
export { KeyObjectSheet } from './KeyObjectSheet';
import { Config } from './GoogleSheetsCMS';
declare module 'jovo-core/dist/src/util/Cms' {
    interface Cms {
        t(): string | string[] | object | object[];
        i18Next: any;
    }
}
interface AppGoogleSheetsCMSConfig {
    GoogleSheetsCMS?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppCmsConfig extends AppGoogleSheetsCMSConfig {
    }
    interface ExtensiblePluginConfigs extends AppGoogleSheetsCMSConfig {
    }
}
