<template>
  <div class="store-display">
    <json-viewer :expand-depth="1" :value="content"></json-viewer>
  </div>
</template>

<script lang="ts">
import { RequestEvents } from 'jovo-client-web-vue';
import set from 'lodash.set';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'store-display',
})
export default class StoreDisplay extends Vue {
  content: any = {};

  mounted() {
    this.setStoreData();

    this.$assistant.on(RequestEvents.Success, () => {
      this.setStoreData();
    });
  }

  private setStoreData() {
    const copy = {};

    for (const key in this.$assistant.store) {
      if (this.$assistant.store.hasOwnProperty(key) && key !== '$client') {
        set(copy, key, (this.$assistant.store as any)[key]);
      }
    }
    this.content = copy;
  }
}
</script>

<style scoped></style>
