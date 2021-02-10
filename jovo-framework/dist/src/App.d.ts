import { AppAnalyticsConfig, AppCmsConfig, AppDbConfig, AppNluConfig, AppPlatformConfig, BaseApp, ExtensibleConfig, Handler, Host, I18NextConfig } from 'jovo-core';
import { Config as LoggingConfig } from './middleware/logging/BasicLogging';
import { Config as JovoUserConfig } from './middleware/user/JovoUser';
export declare class App extends BaseApp {
    config: Config;
    $config: Config;
    constructor(config?: Config);
    mergePluginConfiguration(): void;
    initConfig(): void;
    init(): void;
    handle(host: Host): Promise<void>;
    /**
     * @deprecated
     * @param config
     */
    setConfig(config: Config): void;
}
export interface Config extends ExtensibleConfig {
    keepSessionDataOnSessionEnded?: boolean;
    logging?: boolean | LoggingConfig;
    inputMap?: {
        [key: string]: string;
    };
    user?: JovoUserConfig | {
        [key: string]: any;
        metaData: boolean;
        context: boolean;
    };
    i18n?: I18NextConfig;
    db?: AppDbConfig;
    analytics?: AppAnalyticsConfig;
    platform?: AppPlatformConfig;
    cms?: AppCmsConfig;
    nlu?: AppNluConfig;
    handlers?: Handler[];
}
