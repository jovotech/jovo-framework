<template>
  <div class="input-recognized-speech">
    <p class="mb-0 mt-0">{{ content }}</p>
  </div>
</template>

<script lang="ts">
import { AudioHelper, InputRecordEvents, RequestEvents } from 'jovo-client-web-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'input-recognized-speech',
})
export default class InputRecognizedSpeech extends Vue {
  content = '';

  mounted() {
    this.$assistant.on(RequestEvents.Success, this.afterRequest);
    this.$assistant.on(RequestEvents.Error, this.afterRequest);
    this.$assistant.on(InputRecordEvents.SpeechRecognized, (event: SpeechRecognitionEvent) => {
      this.content = AudioHelper.textFromSpeechRecognition(event);
    });
  }

  private afterRequest() {
    this.content = '';
  }
}
</script>

<style scoped></style>
