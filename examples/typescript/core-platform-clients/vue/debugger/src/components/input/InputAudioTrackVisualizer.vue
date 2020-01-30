<template>
  <div
    :style="{ paddingLeft: canvasPadding, paddingRight: canvasPadding }"
    class="input-audio-track-visualizer"
    ref="container"
  >
    <canvas :height="canvasHeight" :width="canvasWidth" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { AudioVisualizer } from 'jovo-client-web-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'input-audio-track-visualizer',
})
export default class InputAudioTrackVisualizer extends Vue {
  @Prop({ required: true, type: Number })
  canvasWidth!: number;

  @Prop({ required: false, type: Number, default: 70 })
  canvasHeight!: number;

  @Prop({ required: false, type: String, default: '20px' })
  canvasPadding!: string;

  visualizer: AudioVisualizer | null = null;

  mounted() {
    this.visualizer = new AudioVisualizer(this.$refs.canvas as HTMLCanvasElement);
    this.$assistant.setVisualizer(this.visualizer);
  }

  @Watch('canvasWidth')
  onWidthChange(newWidth: number) {
    this.$nextTick(() => {
      this.visualizer!.drawLine();
    });
  }
}
</script>

<style lang="scss" scoped></style>
