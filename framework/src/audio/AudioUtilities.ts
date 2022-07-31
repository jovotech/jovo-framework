import { Stream } from 'stream';

export class AudioUtilities {
  static getSamplesFromBase64(base64: string): Float32Array {
    const binaryBuffer = Buffer.from(base64, 'base64').toString('binary');
    const length = binaryBuffer.length / Float32Array.BYTES_PER_ELEMENT;
    const view = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
    const samples = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const p = i * 4;
      view.setUint8(0, binaryBuffer.charCodeAt(p));
      view.setUint8(1, binaryBuffer.charCodeAt(p + 1));
      view.setUint8(2, binaryBuffer.charCodeAt(p + 2));
      view.setUint8(3, binaryBuffer.charCodeAt(p + 3));
      samples[i] = view.getFloat32(0, true);
    }
    return samples;
  }

  static sampleDown(
    samples: Float32Array,
    currentSampleRate: number,
    newSampleRate: number,
  ): Float32Array {
    if (newSampleRate >= currentSampleRate) {
      return samples;
    }
    const ratio = currentSampleRate / newSampleRate;
    const newLength = Math.round(samples.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < samples.length; i++) {
        accum += samples[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  static encodeSamplesToWav(samples: Float32Array, sampleRate: number): Buffer {
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
    return Buffer.from(view.buffer);
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

  static getBase64Audio(stream: Stream): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const _buf = Array<any>();

      stream.on('data', (chunk) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf).toString('base64')));
      stream.on('error', (err) => reject(`error converting stream - ${err}`));
    });
  }

  static buildBase64Uri(data: string, mimeType: string): string {
    return `data:${mimeType};base64,${data}`;
  }
}
