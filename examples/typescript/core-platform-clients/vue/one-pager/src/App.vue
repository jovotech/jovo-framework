<template>
  <div id="app">

    <one-pager></one-pager>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OnePager from '@/views/OnePager.vue';
import ConversationDisplay from '@/components/conversation/ConversationDisplay.vue';
import InputControlButtonsSimple from '@/components/input/InputControlButtonsSimple.vue';

@Component({
  components: { InputControlButtonsSimple, ConversationDisplay, OnePager },
})
export default class App extends Vue {
  get assistant() {
    return this.$assistant;
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Roboto', sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  display: flex;
  background-color: #f5f5f5;
}

html, body {
  height: 100%;
}
</style>
