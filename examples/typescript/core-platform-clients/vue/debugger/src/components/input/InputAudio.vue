<template>
  <div ref="container">
    <audio :src="source" controls></audio>
  </div>
</template>

<script lang="ts">
import { AudioRecordedPayload, InputRecordEvents } from 'jovo-client-web-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'input-audio',
})
export default class InputAudio extends Vue {
  source = '';

  mounted() {
    this.$assistant.on(InputRecordEvents.Recorded, this.onAudioRecorded.bind(this));
  }

  private onAudioRecorded(payload: AudioRecordedPayload) {
    this.source = URL.createObjectURL(payload.raw);
  }
}
</script>

<style scoped></style>
