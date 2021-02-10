/// <reference types="node" />
export declare class AudioEncoder {
    static sampleDown(buffer: Float32Array, currentSampleRate: number, newSampleRate: number): Float32Array;
    static encodeToWav(samples: Float32Array, sampleRate: number): Buffer;
    private static floatTo16BitPCM;
    private static writeUTFBytes;
}
