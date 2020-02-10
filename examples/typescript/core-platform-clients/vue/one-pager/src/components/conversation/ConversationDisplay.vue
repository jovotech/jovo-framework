<template>
  <div class="conversation-display" ref="container">
    <conversation-part-display @changeLoading="changeLoading"  :key="`part-${index}`" :part="part" v-for="(part, index) in messages">
    </conversation-part-display>

    <div class="spinner"  v-if="isLoading">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  </div>
</template>

<script lang="ts">
import ConversationPartDisplay from '@/components/conversation/ConversationPartDisplay.vue';
import { ConversationPart } from 'jovo-client-web-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'conversation-display',
  components: { ConversationPartDisplay },
})
export default class ConversationDisplay extends Vue {
  @Prop({ required: false, type: String, default: '600px' })
  maxHeight!: string;

  @Prop({ required: false, type: Array, default: [] })
  messages!: ConversationPart[];

  addNextResponse = false;
  endSession: boolean = false;
  activeIndex: number = -1;

  // parts: ConversationPart[] = [];

  isLoading: boolean = false;


  constructor(){
    super();

  };

  changeLoading(value: boolean) {
    setTimeout(() => {
      this.isLoading = value;
    }, 300);
  }

  mounted() {
    this.$assistant.on('conversation.addpart', (part: ConversationPart) => {

      if (part.type === 'request') {
        this.isLoading = true;

        if (part.subType !== 'start') {

          this.messages.push(part)
        }

      } else if (part.type === 'response') {
        setTimeout(() => {
          this.isLoading = false;
          this.messages.push(part)
        }, 300);
      }



    })
  }

  // get parts(): ConversationPart[] {
  //   return this.$assistant.data.conversationParts;
  // }

  @Watch('parts')
  onPartsChange() {
    this.$nextTick(() => {
      const container = this.$refs.container as Element;
      container.scrollTop = container.scrollHeight;
    });
  }
}
</script>

<style lang="scss" scoped>
.conversation-display {
  overflow-y: auto;
  padding: 1em;
}


.spinner {
  width: 200px;
  height: 40px;
  padding: 30px;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
}
</style>
