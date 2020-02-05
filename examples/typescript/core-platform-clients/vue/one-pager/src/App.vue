<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Debugger from '@/views/Debugger.vue';
import Full from '@/views/OnePager.vue';

@Component({
  components: { Full, Debugger },
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
