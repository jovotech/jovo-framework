<template>
  <div style="height: 100%;">
<!--    <iframe-->
<!--      src="https://www.jovo.tech"-->
<!--    ></iframe>-->
    <div id="app">
      <one-pager></one-pager>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OnePager from '@/views/OnePager.vue';
import ConversationDisplay from '@/components/conversation/ConversationDisplay.vue';

@Component({
  components: {  ConversationDisplay, OnePager },
})
export default class App extends Vue {
  get assistant() {
    return this.$assistant;
  }
}
</script>

<style lang="scss">
    $break-small: 320px;

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  display: flex;
  background-color: #f5f5f5;
}

iframe {
  position: absolute;
  height: 100%;
  width: 100%;
  border: none;
}

html,
body {
  height: 100%;
}
</style>
