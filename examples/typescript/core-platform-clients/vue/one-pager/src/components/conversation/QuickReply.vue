<template>
  <div class="quick-reply" @click="handleClick">{{ buttonLabel }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'quick-reply',
})
export default class QuickReply extends Vue {
  @Prop({ required: false, type: String })
  id!: string;
  @Prop({ required: false, type: String })
  label!: string;
  @Prop({ required: true, type: String })
  value!: string;

  constructor() {
    super();
  }

  get buttonLabel() {
    return this.label || this.value;
  }

  handleClick() {
    this.$assistant.sendText(this.value, false);
    this.$emit('clearQuickReplies');
  }
}
</script>

<style lang="scss" scoped>
.quick-reply {
  display: inline-block;
  margin-left: 20px;
  font-weight: 300;
  background: #eeeeee;
  padding: 14px 17px !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
</style>
