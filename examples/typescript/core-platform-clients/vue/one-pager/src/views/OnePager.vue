<template>
<!--  <div class="wrapper">-->
<!--    <input-control-buttons></input-control-buttons>-->

<!--    <div  v-if="false" class="speech"><div class="text">{{content}}</div></div>-->
<!--    <div v-if="isRecording" class="modal-backdrop">-->
<!--      <div class="text">{{content}}</div>-->
<!--      <input-audio-track-visualizer-->
<!--              :canvas-height="240"-->
<!--              :canvas-padding="canvas.padding"-->
<!--              :canvas-width="canvas.width"-->
<!--      ></input-audio-track-visualizer>-->
<!--    </div>-->
<!--  </div>-->
    <el-container>
<!--        <el-header style="background: white;">-->
<!--            Hello-->
<!--        </el-header>-->
        <el-main>
            <div v-if="!ongoingConversation" class="start-button">
                <img src="@/assets/cat.png"/>
                <start-button @startConversation="startConversation"></start-button>
            </div>

            <conversation-display :messages="messages"></conversation-display>

        </el-main>
        <el-footer height="20">
                <div v-if="ongoingConversation" class="text-input-container">

                    <el-row :gutter="5">
                        <el-col :span="20" class="text-input">
                            <el-input  type="textarea" @keypress.native.prevent.enter="handleSendText" size="large" v-model="inputText" placeholder="Type something..." :autosize="{ minRows: 1, maxRows: 4}">
                            </el-input>
                            <span v-if="inputText.length > 0">ENTER</span>
                        </el-col>
                        <el-col :span="4">
                            <el-button v-if="!isRecording" icon="el-icon-microphone" type="default" @click="handleStartRecording" class="submit-button" round></el-button>
                            <el-button v-if="isRecording" icon="el-icon-microphone" type="default"  @click="handleStopRecording" class="submit-button is-recording" round></el-button>

                        </el-col>
                    </el-row>
                </div>
<!--            <div  v-if="isRecording" class="speech"><div class="text">{{content}}</div></div>-->
        </el-footer>
    </el-container>

<!--    <el-row type="flex" justify="center">-->
<!--    <el-col :xs="24" :sm="24" :lg="12" class="container">-->
<!--       -->

<!--    </el-col>-->
<!--      <el-col :xs="24" :lg="12" :align="bottom">-->
<!--          <div  v-if="true" class="speech"><div class="text">{{content}}</div></div>-->
<!--      </el-col>-->
<!--  </el-row>-->
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
import {
  AudioHelper,
  InputRecordEvents,
  RequestEvents,
} from '../../../../../../../jovo-clients/jovo-client-web/dist/src';
import StartButton from '@/components/input/StartButton.vue';
import { ConversationPart } from '../../../../../../../jovo-clients/jovo-client-web/dist';
// @ts-ignore
import VueSocketIO from 'vue-socket.io';

@Component({
  components: {
    StartButton,
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
export default class OnePager extends Vue {
  canvas = {
    padding: '50px',
    width: 1200,
  };
  inputText = '';
  volumeSliderValue: number = 0;
  content: string = '';

  ongoingConversation: boolean = false;
  $socket: any;

  messages: ConversationPart[] = [];


  constructor(){
    super();

    // @ts-ignore
    this.$options.sockets = {
      connect(){
        console.log('connect was called');
      },
      disconnect(){
        console.log('disconnect was called');
      },
      sendFromApp(data: any) {
        console.log(data);

        this.messages.push({
          type: 'response',
          subType: 'text',
          value: data.text,
          label: data.text
        });
      }
    };
  };

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
      this.inputText = AudioHelper.textFromSpeechRecognition(event);

    });
    this.volumeSliderValue = this.$assistant.volume;

    this.$assistant.on('conversation.addpart', (part: ConversationPart) => {

      if (part.subType === 'start') {
        this.ongoingConversation = true;
      }
    });

  }

  handleStartRecording() {
      if (!this.isRecording) {
        this.$assistant.startRecording();
      }
  }
  handleStopRecording() {
    this.$assistant.stopRecording();
  }

    startConversation() {
      this.ongoingConversation = true;

    }

  private afterRequest() {
    this.inputText = '';
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.setCanvasWidth);
  }

  handleSendText() {
    if (this.inputText !== '') {
      // this.$assistant.sendText(this.inputText, false);
      this.$socket.emit('sendFromWidget', {
        text: this.inputText
      });
      this.messages.push({
        type: 'request',
        subType: 'text',
        value: this.inputText,
        label: this.inputText
      });

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
  background: url(~@/assets/speech.png);
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


  .start-button {
      margin-top: 250px;
      text-align: center;
      img {
          border-radius: 50%;
          width: 100px;
          border: 8px solid white;
          -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          margin-bottom: 10px;
      }
  }
  .el-main {
      padding: 0 !important;
  }
    .el-footer {
        padding: 0 !important;
    }

    .text-input-container {
        padding: 10px;

        .el-input--large {
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            font-size: 1.25em;
            border-radius: 10px;
            input, textarea {
                border-radius: 20px;
                line-height: 46px;
                height: 46px;
            }
        }

        .text-input {
            position: relative;
            span {
                position: absolute;
                right: 20px;
                bottom: 14px;
                padding: 5px;
                font-size: 14px;
                opacity: 0.15;
                background: #ededed;
                border: 1px solid #b3b3b3;
            }
        }
    }
    .submit-button {
        /*position: absolute;*/
        /*right: 13px;*/
        /*bottom: 13px;*/
        padding: 14px 17px !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        i {
            font-size: 28px;
        }
    }

    .is-recording {
        background: #ff362a !important;
        color: white !important;
    }
    .audio-button {

    }
</style>
