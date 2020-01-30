<template>
  <div :style="{ maxHeight }" class="conversation-display" ref="container">
    <conversation-part-display :key="`part-${index}`" :part="part" v-for="(part, index) in parts">
    </conversation-part-display>
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

  addNextResponse = false;
  endSession: boolean = false;
  activeIndex: number = -1;

  get parts(): ConversationPart[] {
    return this.$assistant.data.conversationParts;
  }

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
}
</style>
