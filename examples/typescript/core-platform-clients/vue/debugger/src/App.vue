<template>
  <div id="app">
    <debugger></debugger>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Debugger from '@/views/Debugger.vue';

@Component({
  components: { Debugger },
})
export default class App extends Vue {
  get assistant() {
    return this.$assistant;
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
