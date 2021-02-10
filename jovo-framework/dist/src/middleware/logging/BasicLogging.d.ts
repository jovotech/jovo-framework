import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    logging?: boolean;
    request?: boolean;
    response?: boolean;
    requestObjects?: string[];
    responseObjects?: string[];
    maskRequestObjects?: string[];
    maskResponseObjects?: string[];
    maskValue?: any;
    excludeRequestObjects?: string[];
    excludeResponseObjects?: string[];
    space?: string;
    styling?: boolean;
    colorizeSettings?: {
        colors: {
            BRACE?: string;
            BRACKET?: string;
            COLON?: string;
            COMMA?: string;
            STRING_KEY?: string;
            STRING_LITERAL?: string;
            NUMBER_LITERAL?: string;
            BOOLEAN_LITERAL?: string;
            NULL_LITERAL?: string;
        };
    };
}
export declare class BasicLogging implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    routingLogger: (handleRequest: HandleRequest) => void;
    requestLogger: (handleRequest: HandleRequest) => void;
    responseLogger: (handleRequest: HandleRequest) => void;
    style(text: string): string;
}
