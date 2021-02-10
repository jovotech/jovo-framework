import { JWT } from 'google-auth-library';
import { Extensible, HandleRequest, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    credentialsFile?: string;
}
export declare class GCloudTts implements Plugin {
    config: Config;
    jwtClient?: JWT;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    setup(handleRequest: HandleRequest): Promise<void>;
    tts(jovo: Jovo): Promise<void>;
    private applyTTS;
    private getAudioTagFromResult;
    private textToSpeech;
    private initializeJWT;
}
