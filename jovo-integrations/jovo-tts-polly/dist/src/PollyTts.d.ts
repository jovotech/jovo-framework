import { LanguageCode, OutputFormat, SpeechMarkTypeList, VoiceId } from 'aws-sdk/clients/polly';
import { Extensible, Jovo, Plugin, PluginConfig } from 'jovo-core';
import './';
import { AmazonCredentials } from './Interfaces';
export interface Config extends PluginConfig {
    credentials?: Partial<AmazonCredentials>;
    lexiconNames?: string[];
    outputFormat?: OutputFormat;
    sampleRate?: number;
    speechMarkTypes?: SpeechMarkTypeList;
    voiceId?: VoiceId;
    languageCode?: LanguageCode;
}
export declare class PollyTts implements Plugin {
    config: Config;
    private $polly;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    tts(jovo: Jovo): Promise<void>;
    private applyTTS;
    private getAudioTagFromPollyResult;
    private textToSpeech;
    private validateConfig;
}
