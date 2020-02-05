<template>
  <el-row class="conversation-part-container" type="flex">
    <div :class="classes" class="conversation-part">
      <template v-if="part.subType === 'audio'">
        <audio controls="controls">
          <source :src="part.value" type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </template>
      <template v-else>
        {{ part.label }}
      </template>
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

<style lang="scss" scoped>
.conversation-part-container {
  margin-bottom: 15px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  & .conversation-part {
    border: 1px solid black;
    max-width: 45%;
    padding: 5px;

    &.request {
      margin-left: auto;
      background: #fff;
      border-color: darken(#fff, 10%);

      &.start {
        border-color: #72ef93;
      }
    }

    &.response {
      background: #abcdef;
      border-color: darken(#abcdef, 10%);

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
