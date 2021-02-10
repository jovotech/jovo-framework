import { Extensible, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    endpointKey?: string;
    endpointRegion?: string;
    locale?: string;
}
export declare class AzureTts implements Plugin {
    config: Config;
    currentToken?: {
        value: string;
        expiresAt: Date;
    };
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    tts(jovo: Jovo): Promise<void>;
    private applyTTS;
    private getAudioTagFromResult;
    private textToSpeech;
    private updateTokenIfNecessary;
    private isTokenExpired;
    private updateToken;
    private validateConfig;
}
