export { I18Next, Config } from './I18Next';
declare module 'jovo-core/dist/src/util/Cms' {
    interface Cms {
        t(key: string, obj?: any): string | string[];
    }
}
import { Config } from './I18Next';
interface AppI18NextConfig {
    I18Next?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppCmsConfig extends AppI18NextConfig {
    }
    interface ExtensiblePluginConfigs extends AppI18NextConfig {
    }
}
declare module 'jovo-core/dist/src/core/Jovo' {
    interface Jovo {
        t(key: string, obj?: any): string | string[];
    }
}
declare module 'jovo-core/dist/src/util/SpeechBuilder' {
    interface SpeechBuilder {
        t(key: string, obj?: any): this;
        addT(key: string, obj?: any): this;
    }
}
