<template>
  <div>
    <div class="container">
      <conversation-display max-height="700px"></conversation-display>
    </div>
    <div class="widget mobile-widget">
      <el-row justify="center" type="flex">
        <el-row align="middle" type="flex">
          <div class="mr-1">
            <el-button
              :disabled="!isRecording"
              @click="handleAbortRecording"
              circle
              class="button"
              icon="el-icon-delete"
              size="small"
              type="warning"
            >
            </el-button>
          </div>
          <div>
            <el-badge :type="isRecording ? 'danger' : 'success'" is-dot>
              <el-button
                :icon="isRecording ? 'el-icon-video-pause' : 'el-icon-video-play'"
                @click="handleToggleRecording"
                circle
                class="button big"
                size="medium"
                type="primary"
              >
              </el-button>
            </el-badge>
          </div>
          <div class="ml-1">
            <el-popover @after-enter="onPopoverShow">
              <div>
                <el-input
                  @keydown.native.enter.prevent="handleSendText"
                  ref="input"
                  size="small"
                  v-model="textInput"
                >
                  <template #append>
                    <el-button @click="handleSendText" icon="el-icon-finished"> </el-button>
                  </template>
                </el-input>
              </div>
              <el-button
                circle
                class="button"
                icon="el-icon-chat-square"
                size="small"
                slot="reference"
                type="info"
              >
              </el-button>
            </el-popover>
          </div>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ConversationDisplay from '@/components/conversation/ConversationDisplay.vue';

@Component({
  name: 'mobile-widget',
  components: { ConversationDisplay },
})
export default class MobileWidget extends Vue {
  textInput = '';

  get isRecording(): boolean {
    return this.$assistant.data.isRecording;
  }

  get hasSoundOutput(): boolean {
    return this.$assistant.data.isPlayingAudio || this.$assistant.data.isSpeakingText;
  }

  handleAbortRecording() {
    this.$assistant.abortRecording();
  }

  handleToggleRecording() {
    if (this.isRecording) {
      this.$assistant.stopRecording();
    } else {
      if (this.hasSoundOutput) {
        this.$assistant.stopAudioOutput();
      }
      this.$assistant.startRecording();
    }
  }

  handleSendText() {
    if (this.textInput !== '') {
      this.$assistant.sendText(this.textInput);
      this.textInput = '';
    }
  }

  onPopoverShow() {
    (this.$refs.input as any).focus();
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  margin-bottom: 55px;
}

.widget {
  &.mobile-widget {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 55px;
    border-top: 1px solid black;
    background: #ddd;

    & .el-row {
      height: 100%;
    }

    & .button {
      padding: 6px;
      font-size: 20px;

      &.big {
        padding: 5px;
        font-size: 30px;
      }
    }
  }
}
</style>
