<template>
  <div class="input-control-buttons" ref="container">
    <el-button
      :disabled="isRecording"
      :size="buttonSize"
      :type="startButtonType"
      @click="handleStartConversation"
      class="start-button"
      round
    >
      Start conversation
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ElementUIComponentSize } from 'element-ui/types/component';
import { ButtonType } from 'element-ui/types/button';

@Component({
  name: 'start-button',
})
export default class StartButton extends Vue {
  @Prop({ required: false, type: String, default: 'large' })
  buttonSize!: ElementUIComponentSize;

  @Prop({ required: false, type: String, default: 'success' })
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

  handleStartConversation() {
    this.$emit('startConversation');
  }

  handleStartRecording() {
    if (!this.isRecording) {
      this.$assistant.startRecording();
      this.$assistant.on('request.success', (data: any) => {
        // on success
      });
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

<style scoped>
.start-button {
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-size: 24px;
}
</style>
