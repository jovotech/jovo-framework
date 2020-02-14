<template>
  <div class="conversation-display" ref="container">
    <conversation-part-display
      :key="`part-${index}`"
      :part="part"
      v-for="(part, index) in messages"
    >
    </conversation-part-display>

  </div>
</template>

<script lang="ts">
import ConversationPartDisplay from '@/components/conversation/ConversationPartDisplay.vue';
import { ConversationPart } from 'jovo-client-web-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ConversationEvents } from '../../../../../../../../jovo-clients/jovo-client-web/src';

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

  constructor() {
    super();
  }

  mounted() {
    this.$assistant.on(ConversationEvents.AddPart, (part: ConversationPart) => {
      if (part.type === 'request') {
        if (part.subType !== 'start') {
          this.messages.push(part);
        }
      } else if (part.type === 'response') {
        setTimeout(() => {
          this.messages.push(part);
        }, 300);
      }
    });
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
  overflow-x: hidden;
  padding: 1em;
}


</style>
