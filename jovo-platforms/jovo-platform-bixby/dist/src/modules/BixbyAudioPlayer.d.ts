import { Plugin } from 'jovo-core';
import { Bixby } from '../Bixby';
import { BixbyCapsule } from '..';
export declare type RepeatMode = 'OFF' | 'ALL' | 'ONE';
export declare type Format = '';
export interface Stream {
    url: string;
    format?: string;
    token?: string;
    offsetInMilliseconds?: number;
}
export interface AudioInfo {
    id?: string;
    stream: Stream;
    title?: string;
    subtitle?: string;
    artist?: string;
    albumArtUrl?: string;
    duration?: number;
    albumName?: string;
}
export declare class BixbyAudioPlayerPlugin implements Plugin {
    install(bixby: Bixby): void;
    type(capsule: BixbyCapsule): void;
    session(capsule: BixbyCapsule): void;
    output(capsule: BixbyCapsule): void;
}
export declare class BixbyAudioPlayer {
    readonly category = "MUSIC";
    audioItem: AudioInfo[];
    displayName: string;
    doNotWaitForTTS: boolean;
    repeatMode?: RepeatMode;
    startAudioItemIndex?: number;
    setRepeatMode(repeatMode: RepeatMode): this;
    setDisplayName(displayName: string): this;
    waitForTTS(mode: boolean): this;
    setDoNotWaitForTTS(mode: boolean): this;
    setStartAudioItemIndex(index: number): this;
    play(item: AudioInfo): this;
    enqueue(item: AudioInfo): this;
    addAudioStream(item: AudioInfo): this;
    addAudioStreams(items: AudioInfo[]): this;
    setAudioStream(item: AudioInfo): this;
}
