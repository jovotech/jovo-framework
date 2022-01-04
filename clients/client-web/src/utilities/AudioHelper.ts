export class AudioHelper {
  static textFromSpeechRecognition(event: SpeechRecognitionEvent): string {
    return event.results[event.results.length - 1]?.[0]?.transcript || '';
  }

  static mergeChunks(chunks: Float32Array[], chunkLength: number): Float32Array {
    const merged = new Float32Array(chunkLength);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    return merged;
  }

  static sampleDown(
    buffer: Float32Array,
    recordSampleRate: number,
    exportSampleRate: number,
  ): Float32Array {
    if (exportSampleRate === recordSampleRate) {
      return buffer;
    }
    const ratio = recordSampleRate / exportSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  static toWavBlob(samples: Float32Array, sampleRate: number): Blob {
    const wavView = this.encodeWav(samples, sampleRate);
    return new Blob([wavView], { type: 'audio/wav' });
  }

  static encodeWav(samples: Float32Array, sampleRate: number): DataView {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    // RIFF chunk descriptor
    this.writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 32 + samples.length * 2, true);
    this.writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    this.writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // chunkSize
    view.setUint16(20, 1, true); // wFormatTag
    view.setUint16(22, 1, true); // wChannels
    view.setUint32(24, sampleRate, true); // dwSamplesPerSec
    view.setUint32(28, sampleRate * 2, true); // dwAvgBytesPerSec
    view.setUint16(32, 2, true); // wBlockAlign
    view.setUint16(34, 16, true); // wBitsPerSample
    // data sub-chunk
    this.writeUTFBytes(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    this.floatTo16BitPCM(view, 44, samples);
    return view;
  }

  private static floatTo16BitPCM(view: DataView, offset: number, val: Float32Array) {
    for (let i = 0; i < val.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, val[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  private static writeUTFBytes(view: DataView, offset: number, val: string) {
    for (let i = 0; i < val.length; i++) {
      view.setUint8(offset + i, val.charCodeAt(i));
    }
  }
}
