<template>
  <div class="request-json-display">
    <json-viewer :expand-depth="1" :value="content" v-if="isVisible"></json-viewer>
  </div>
</template>

<script lang="ts">
import JsonDisplayMixin from '@/mixins/JsonDisplayMixin';
import { RequestEvents } from 'jovo-client-web-vue';
import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'request-json-display',
})
export default class RequestJsonDisplay extends mixins(JsonDisplayMixin) {
  mounted() {
    this.$assistant.on(RequestEvents.Data, (data: any) => {
      this.content = this.getFilteredCopy(data);
    });
  }
}
</script>

<style scoped></style>
