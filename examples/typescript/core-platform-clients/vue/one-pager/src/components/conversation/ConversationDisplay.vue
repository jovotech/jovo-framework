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
import { ConversationPart, ConversationEvents } from 'jovo-client-web-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'conversation-display',
  components: { ConversationPartDisplay },
})
export default class ConversationDisplay extends Vue {

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
}
</script>

<style lang="scss" scoped>
.conversation-display {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  padding-bottom: 72px;
}


</style>
