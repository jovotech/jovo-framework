<template>
  <el-row class="conversation-part-container" type="flex">
    <div :class="classes" class="conversation-part">
      {{ part.label }}
    </div>
  </el-row>
</template>

<script lang="ts">
import { ConversationPart } from 'jovo-client-web-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'conversation-part-display',
})
export default class ConversationPartDisplay extends Vue {
  @Prop({ required: true, type: Object })
  part!: ConversationPart;

  get classes(): Record<string, any> {
    const classes = {
      [this.part.type]: true,
    };
    if (this.part.subType) {
      classes[this.part.subType] = true;
    }

    return classes;
  }
}
</script>

<style lang="scss">
.conversation-part-container {
  margin-bottom: 15px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.2em;
  font-weight: 400;

  margin-top: 30px;

  & .conversation-part {
    border: 1px solid black;
    max-width: 55%;
    padding: 15px;
    position: relative;
    background: #c0c0c0;
    border-radius: 0.4em;
    font-family: 'Roboto', sans-serif;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);

    &.request {
      margin-left: auto;
      background: #fff;
      border-color: darken(#fff, 10%);


      &.start {
        margin: 0 auto;
      }
    }

    &.response {
      background: #424242;
      border: none;
      color: white;

      &.session_end {
        border-color: #ef6b63;
      }
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
