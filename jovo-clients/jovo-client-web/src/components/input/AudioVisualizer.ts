import { AudioProcessingPayload } from '../..';

interface VisualizerConfig {
  backgroundColor?: string;
  width?: number;
  color?: string;

  // tslint:disable-next-line:no-any
  [index: string]: any;
}

export class AudioVisualizer {
  // tslint:disable-next-line:no-any
  [index: string]: any;

  backgroundColor = 'transparent';
  width = 1;
  color = '#abcdef';

  constructor(private readonly $canvas: HTMLCanvasElement, config?: VisualizerConfig) {
    if (config) {
      for (const prop in config) {
        if (config.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
          this[prop] = config[prop];
        }
      }
    }
  }

  draw(payload: AudioProcessingPayload) {
    const { width, height } = this.$canvas;
    const ctx = this.$canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.fillStyle = this.backgroundColor;
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;

    ctx.beginPath();

    const sliceWidth = width / payload.bufferLength;
    let x = 0;
    for (let i = 0; i < payload.bufferLength; i++) {
      const value = payload.isEmptyBuffer ? 1 : payload.data[i] / 128;
      const y = (value * height) / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  drawLine() {
    const payload = this.getEmptyBufferPayload();
    this.draw(payload);
  }

  private getEmptyBufferPayload(): AudioProcessingPayload {
    return {
      bufferLength: 1024,
      data: new Uint8Array(1024),
      isEmptyBuffer: true,
    };
  }
}
