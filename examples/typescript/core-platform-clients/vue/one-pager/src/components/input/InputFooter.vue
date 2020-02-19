<template>
  <div>
    <div class="quick-reply-container">
      <quick-reply
        v-for="quickReply in quickReplies"
        :id="quickReply.id"
        :label="quickReply.label"
        :value="quickReply.value"
        v-bind:key="quickReply.value"
        @clearQuickReplies="quickReplies = []"
      >
      </quick-reply>
    </div>
    <div class="text-input-container">
      <el-input
        type="textarea"
        ref="textInput"
        @keypress.native.prevent.enter="handleSendText"
        size="large"
        v-model="inputText"
        placeholder="Type something..."
        :autosize="{ minRows: 1, maxRows: 4 }"
      >
      </el-input>
      <span v-if="inputText.length > 0" class="enter">ENTER</span>
      <el-button
        icon="el-icon-microphone"
        type="default"
        @mousedown.native="handleStartRecording" @mouseleave.native="handleStopRecording" @mouseup.native="handleStopRecording" @touchstart.native="handleStartRecording" @touchend="handleStopRecording" @touchcancel.native="handleStopRecording"
        class="submit-button"
        :class="{'is-recording': isRecording}"
        round
      ></el-button>
<!--      <el-button-->
<!--        v-if="isRecording"-->
<!--        icon="el-icon-microphone"-->
<!--        type="default"-->
<!--        @click="handleStopRecording"-->
<!--        class="submit-button is-recording"-->
<!--        round-->
<!--      ></el-button>-->
    </div>
    <!--            <div  v-if="isRecording" class="speech"><div class="text">{{content}}</div></div>-->
  </div>
</template>

<script lang="ts">
import {
  InputRecordEvents,
  AudioHelper,
  QuickReply as QR,
  ResponseEvents,
  RequestEvents,
  ConversationEvents,
  ConversationPart,
} from 'jovo-client-web-vue';
import { Component, Vue } from 'vue-property-decorator';
import QuickReply from '@/components/conversation/QuickReply.vue';

@Component({
  name: 'input-footer',
  components: {
    QuickReply,
  },
})
export default class InputFooter extends Vue {
  quickReplies: QR[] = [];
  inputText = '';
  content: string = '';
  mounted() {
    this.$assistant.on(ResponseEvents.QuickReplies, (replies: QR[]) => {
      this.quickReplies = replies;
    });
    this.$assistant.on(InputRecordEvents.SpeechRecognized, (event: SpeechRecognitionEvent) => {
      this.content = AudioHelper.textFromSpeechRecognition(event);
      this.inputText = AudioHelper.textFromSpeechRecognition(event);
    });
    this.$assistant.on(RequestEvents.Success, this.afterRequest);
    this.$assistant.on(RequestEvents.Error, this.afterRequest);
    this.$assistant.on(ConversationEvents.AddPart, (part: ConversationPart) => {
      if (part.subType === 'start') {
        this.focusTextInput();
      }
    });
  }
  handleSendText() {
    if (this.inputText !== '') {
      this.$assistant.sendText(this.inputText, false);
      this.inputText = '';
    }
  }


  get isRecording(): boolean {
    return this.$assistant.data.isRecording;
  }
  handleStartRecording() {
    console.log('start recording');
    if (!this.isRecording) {
      this.$assistant.startRecording();
    }
  }
  handleStopRecording() {
    console.log('stop recording');

    this.$assistant.stopRecording();
  }
  focusTextInput() {
    const textField = this.$refs.textInput as HTMLInputElement;

    if (textField) {
      textField.focus();
    }
  }

  private afterRequest() {
    this.inputText = '';
    this.focusTextInput();
  }
}
</script>

<style lang="scss">
  $break-small: 320px;
  $break-large: 1200px;

.el-footer {
  padding: 0 !important;
}

.text-input-container {
  display: flex;
  padding: 10px;

  @media screen and (max-width: $break-small) {
    padding-bottom: 26px;
  }

  @media screen and (min-width: $break-large) {
    padding: 10px;
  }

  .el-input--large {
    flex-grow: 1;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-size: 1.25em;
    border-radius: 20px;
    margin-right: 10px;
    input,
    textarea {
      border-radius: 20px;
      line-height: 46px;
      height: 46px;
      resize: none;
      &:focus {
        outline: none;
        border-color: #3c9bfc !important;
      }
    }
  }

  .text-input {
    position: relative;
  }
  span.enter {
    position: absolute;
    right: 100px;
    bottom: 23px;
    padding: 5px;
    font-size: 14px;
    opacity: 0.15;
    background: #ededed;
    border: 1px solid #b3b3b3;
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

  &:hover {
    /*border: 1px solid #C0C4CC !important;*/
    /*background-color: #f5f5f5 !important;*/
    /*color: #2b2c2e !important;*/
  }
}
.is-recording {
  background: #ff362a !important;
  color: white !important;
}
.quick-reply-container {
  position: absolute;
  bottom: 85px;
}
</style>
