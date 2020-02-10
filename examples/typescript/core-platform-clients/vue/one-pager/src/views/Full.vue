<template>
  <div class="wrapper">
    <input-control-buttons></input-control-buttons>

    <div  v-if="false" class="speech"><div class="text">{{content}}</div></div>
    <div v-if="isRecording" class="modal-backdrop">
      <div class="text">{{content}}</div>
      <input-audio-track-visualizer
              :canvas-height="240"
              :canvas-padding="canvas.padding"
              :canvas-width="canvas.width"
      ></input-audio-track-visualizer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import InputControlButtons from '../../../debugger/src/components/input/InputControlButtons.vue';
import InputAudio from '../../../debugger/src/components/input/InputAudio.vue';
import RequestProgress from '../../../debugger/src/components/request/RequestProgress.vue';
import LogConsole from '../../../debugger/src/components/log/LogConsole.vue';
import ResponseAudio from '../../../debugger/src/components/response/ResponseAudio.vue';
import ResponseProgress from '../../../debugger/src/components/response/ResponseProgress.vue';
import InputAudioTrackVisualizer from '../../../debugger/src/components/input/InputAudioTrackVisualizer.vue';
import { Card } from 'element-ui';
import ConversationDisplay from '../../../debugger/src/components/conversation/ConversationDisplay.vue';
import StoreDisplay from '../../../debugger/src/components/store/StoreDisplay.vue';
import InputRecognizedSpeech from '../../../debugger/src/components/input/InputRecognizedSpeech.vue';
import RequestJsonDisplay from '../../../debugger/src/components/request/RequestJsonDisplay.vue';
import ResponseJsonDisplay from '../../../debugger/src/components/response/ResponseJsonDisplay.vue';
import {
  AudioHelper,
  InputRecordEvents,
  RequestEvents,
} from '../../../../../../../jovo-clients/jovo-client-web/dist/src';

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
export default class Full extends Vue {
  canvas = {
    padding: '50px',
    width: 1200,
  };
  inputText = '';
  volumeSliderValue: number = 0;
  content: string = '';
  get isRecording(): boolean {
    return this.$assistant.data.isRecording;
  }

  beforeCreate() {
    document.title = 'Debugger';
  }

  mounted() {
    // this.setCanvasWidth();
    // window.addEventListener('resize', this.setCanvasWidth);
    this.$assistant.on(RequestEvents.Success, this.afterRequest);
    this.$assistant.on(RequestEvents.Error, this.afterRequest);
    this.$assistant.on(InputRecordEvents.SpeechRecognized, (event: SpeechRecognitionEvent) => {
      this.content = AudioHelper.textFromSpeechRecognition(event);
    });
    this.volumeSliderValue = this.$assistant.volume;
  }


  private afterRequest() {
    this.content = '';
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

<style lang="scss" >
  body {
  }
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: #000;
  opacity: 0.5;
  padding-bottom: 40px;
  div.text {
    color: white;
    font-size: 74px;
    font-weight: bold;
    text-shadow: 30px 3px 4px #111111;
    text-align: center;
    padding-top: 400px;
  }
}

.speech {
  background: url(/speech.png);
  width: 100%;
  /* margin: 0px auto; */
  height: 300px;
  position: absolute;
  bottom: 0;
  background-position-x: center;
  background-repeat: no-repeat;
  div.text {
    position: absolute;
    bottom: 10px;
    color: white;
    text-shadow: 2px 4px 3px rgba(0,0,0,0.1);
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    font-size: 64px;
    font-weight: bold;
    text-align: center;
    padding-top: 400px;
    background: none;
  }
}
</style>
