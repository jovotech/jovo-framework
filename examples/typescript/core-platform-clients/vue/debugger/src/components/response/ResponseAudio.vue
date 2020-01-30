<template>
  <div ref="container">
    <audio :src="source" controls></audio>
  </div>
</template>

<script lang="ts">
import { AssistantResponse, RequestEvents } from 'jovo-client-web-vue';
import get from 'lodash.get';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'response-audio',
})
export default class ResponseAudio extends Vue {
  source = '';

  mounted() {
    this.$assistant.on(RequestEvents.Success, this.onResponse);
  }

  private async onResponse(data: AssistantResponse) {
    const audio = get(data, 'response.output.speech.audio');
    if (audio) {
      // const blob = await Base64Converter.base64ToBlob(audio, 'audio/mpeg');
      // this.source = URL.createObjectURL(blob);
    }
  }
}
</script>

<style scoped></style>
