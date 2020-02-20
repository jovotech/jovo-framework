<template>
  <div class="input-control-buttons" ref="container">
    <el-button
      :disabled="isRecording"
      :size="buttonSize"
      :type="startButtonType"
      @click="handleStartRecording"
    >
      Start Recording
    </el-button>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ElementUIComponentSize } from 'element-ui/types/component';
import { ButtonType } from 'element-ui/types/button';

@Component({
  name: 'input-control-buttons-simple',
})
export default class InputControlButtonsSimple extends Vue {
  @Prop({ required: false, type: String, default: 'small' })
  buttonSize!: ElementUIComponentSize;

  @Prop({ required: false, type: String, default: 'primary' })
  startButtonType!: ButtonType;

  get isRecording(): boolean {
    return this.$assistant.data.isRecording;
  }

  get hasAnyAudioOutput(): boolean {
    return this.isPlayingAudio || this.isSpeakingText;
  }

  get isSpeakingText(): boolean {
    return this.$assistant.data.isSpeakingText;
  }

  get isPlayingAudio(): boolean {
    return this.$assistant.data.isPlayingAudio;
  }

  handleStartRecording() {
    if (!this.isRecording) {
      this.$assistant.startRecording();
      this.$emit('startRecording');
    }
  }

  handleStopRecording() {
    this.$assistant.stopRecording();
  }

  handleAbortRecording() {
    this.$assistant.abortRecording();
  }

  handleStopAudioOutput() {
    this.$assistant.stopAudioOutput();
  }
}
</script>

<style scoped></style>
