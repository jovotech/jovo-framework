export { DefaultTable } from './DefaultTable';
export { AirtableCMS, Config } from './AirtableCMS';
export { ObjectArrayTable } from './ObjectArrayTable';
export { ResponsesTable } from './ResponsesTable';
export { KeyValueTable } from './KeyValueTable';
import { Config } from './AirtableCMS';
declare module 'jovo-core/dist/src/util/Cms' {
    interface Cms {
        t(): string | string[] | object | object[];
        i18Next: any;
    }
}
interface AppAirtableCMSConfig {
    AirtableCMS?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppCmsConfig extends AppAirtableCMSConfig {
    }
    interface ExtensiblePluginConfigs extends AppAirtableCMSConfig {
    }
}
