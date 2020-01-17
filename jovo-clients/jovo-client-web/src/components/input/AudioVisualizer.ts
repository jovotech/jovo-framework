import { AudioProcessingPayload } from '../..';

interface VisualizerOptions {
  backgroundColor?: string;
  width?: number;
  color?: string;

  [index: string]: any;
}

export class AudioVisualizer {
  [index: string]: any;

  backgroundColor: string = 'transparent';
  width: number = 1;
  color: string = '#abcdef';

  private $canvasCtx: CanvasRenderingContext2D;

  constructor(private readonly $canvas: HTMLCanvasElement, options?: VisualizerOptions) {
    this.$canvasCtx = $canvas.getContext('2d')!;
    if (options) {
      for (const prop in options) {
        if (options.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
          this[prop] = options[prop];
        }
      }
    }
  }

  draw(payload: AudioProcessingPayload) {
    const canvasWidth = this.$canvas.width;
    const canvasHeight = this.$canvas.height;
    this.$canvasCtx.fillStyle = this.backgroundColor;
    this.$canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    this.$canvasCtx.lineWidth = this.width;
    this.$canvasCtx.strokeStyle = this.color;

    this.$canvasCtx.beginPath();

    const sliceWidth = canvasWidth / payload.bufferLength;
    let x = 0;
    for (let i = 0; i < payload.bufferLength; i++) {
      const value = payload.isEmptyBuffer ? 1 : payload.data[i] / 128;
      const y = (value * canvasHeight) / 2;
      if (i === 0) {
        this.$canvasCtx.moveTo(x, y);
      } else {
        this.$canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.$canvasCtx.lineTo(canvasWidth, canvasHeight / 2);
    this.$canvasCtx.stroke();
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
