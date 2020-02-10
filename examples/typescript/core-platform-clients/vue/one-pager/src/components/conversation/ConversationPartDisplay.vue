<template>
  <el-row  class="conversation-part-container" type="flex">

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


  mounted() {
  }
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
  font-size: 1.2em;
  font-weight: 400;



  margin-top: 30px;

  & .conversation-part {
    border: 1px solid black;
    max-width: 45%;
    padding: 25px;
    position: relative;
    background: #c0c0c0;
    border-radius: .4em;
    font-family: 'Roboto', sans-serif;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    &.request {
      margin-left: auto;
      background: #fff;
      border-color: darken(#fff, 10%);

      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-left-color: #fff;
        border-right: 0;
        border-top: 0;
        margin-top: -10px;
        margin-right: -20px;
      }

      &.start {

        margin: 0 auto;
      }
    }

    &.response {


      background: #daecff;
      border-color: #c7e3fe;
      border: none;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 16px solid transparent;
        border-right-color: #daecff;
        border-left: 0;
        border-top: 0;
        margin-top: -8px;
        margin-left: -16px;
      }

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
