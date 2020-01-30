<template>
  <div class="wrapper">
    <div class="debugger">
      <el-row :gutter="25" class="mb-6" type="flex">
        <el-col>
          <el-card class="input-card" header="Controls" ref="inputCard" shadow="hover">
            <el-row align="middle" class="mb-2" type="flex">
              <input-control-buttons></input-control-buttons>
              <div :class="isRecording ? 'red' : 'yellow'" class="ml-2 dot"></div>
            </el-row>

            <el-row align="middle" class="mb-2" type="flex">
              <label style="min-width: 120px;">Send text...</label>
              <el-input @keypress.native.enter="handleSendText" size="small" v-model="inputText">
                <template #append>
                  <el-button @click="handleSendText">
                    Send
                  </el-button>
                </template>
              </el-input>
            </el-row>

            <el-row align="middle" class="mb-2" type="flex">
              <div style="flex: 1;">
                <el-slider
                  :max="1"
                  :min="0"
                  :step="0.1"
                  show-stops
                  v-model="volumeSliderValue"
                ></el-slider>
              </div>
            </el-row>

            <el-row align="middle" class="mb-2" type="flex">
              <h5 class="mt-0 mb-0 mr-2">Recognized speech</h5>
              <input-recognized-speech></input-recognized-speech>
            </el-row>

            <input-audio-track-visualizer
              :canvas-height="40"
              :canvas-padding="canvas.padding"
              :canvas-width="canvas.width"
            ></input-audio-track-visualizer>
          </el-card>
        </el-col>
        <el-col>
          <el-card header="Store" shadow="hover">
            <store-display></store-display>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="25" class="mb-6" type="flex">
        <el-col :span="12">
          <el-card header="Request" shadow="hover">
            <h5 class="mt-0 mb-1">Recorded Audio</h5>
            <input-audio></input-audio>
            <h5 class="mb-1">Upload progress</h5>
            <request-progress></request-progress>
            <request-json-display :excluded-properties="['audio']"></request-json-display>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card header="Response" shadow="hover">
            <h5 class="mt-0 mb-1">Download progress</h5>
            <response-progress></response-progress>
            <h5 class="mb-1">Retrieved Audio</h5>
            <response-audio></response-audio>
            <response-json-display
              :excluded-properties="[
                'response.output.speech.audio',
                'response.output.reprompt.audio',
              ]"
            ></response-json-display>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="25" type="flex">
        <el-col>
          <el-card
            :body-style="{
              padding: '10px 20px',
              maxHeight: '400px',
              overflow: 'auto',
            }"
            header="Log"
            shadow="hover"
          >
            <log-console></log-console>
          </el-card>
        </el-col>
        <el-col>
          <el-card header="Conversation" shadow="hover">
            <conversation-display></conversation-display>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import InputControlButtons from '@/components/input/InputControlButtons.vue';
import InputAudio from '@/components/input/InputAudio.vue';
import RequestProgress from '@/components/request/RequestProgress.vue';
import LogConsole from '@/components/log/LogConsole.vue';
import ResponseAudio from '@/components/response/ResponseAudio.vue';
import ResponseProgress from '@/components/response/ResponseProgress.vue';
import InputAudioTrackVisualizer from '@/components/input/InputAudioTrackVisualizer.vue';
import { Card } from 'element-ui';
import ConversationDisplay from '@/components/conversation/ConversationDisplay.vue';
import StoreDisplay from '@/components/store/StoreDisplay.vue';
import InputRecognizedSpeech from '@/components/input/InputRecognizedSpeech.vue';
import RequestJsonDisplay from '@/components/request/RequestJsonDisplay.vue';
import ResponseJsonDisplay from '@/components/response/ResponseJsonDisplay.vue';

@Component({
  components: {
    ResponseJsonDisplay,
    RequestJsonDisplay,
    InputRecognizedSpeech,
    StoreDisplay,
    ConversationDisplay,
    InputAudioTrackVisualizer,
    ResponseProgress,
    ResponseAudio,
    LogConsole,
    RequestProgress,
    InputAudio,
    InputControlButtons,
  },
})
export default class Debugger extends Vue {
  canvas = {
    padding: '50px',
    width: 0,
  };
  inputText = '';
  volumeSliderValue: number = 0;

  get isRecording(): boolean {
    return this.$assistant.data.isRecording;
  }

  beforeCreate() {
    document.title = 'Debugger';
  }

  mounted() {
    this.setCanvasWidth();
    window.addEventListener('resize', this.setCanvasWidth);

    this.volumeSliderValue = this.$assistant.volume;
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.setCanvasWidth);
  }

  handleSendText() {
    if (this.inputText !== '') {
      this.$assistant.sendText(this.inputText, false);
      this.inputText = '';
    }
  }

  @Watch('volumeSliderValue')
  onVolumeChange(newVal: number) {
    this.$assistant.volume = newVal;
  }

  private setCanvasWidth() {
    const inputCard = this.$refs.inputCard as Card;
    const width = inputCard.$el.clientWidth;
    const padding = parseInt(this.canvas.padding, 10) * 2;

    this.canvas.width = width - padding - 40;
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  padding: 30px;
}

.dot {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 10px;

  &.red {
    background: red;
  }

  &.yellow {
    background: yellow;
  }
}
</style>
