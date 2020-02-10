<template>
  <div ref="container">
    <el-progress
      :percentage="percentage"
      :stroke-width="25"
      status="success"
      text-inside
    ></el-progress>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import ProgressMixin from '@/mixins/ProgressMixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'response-progress',
})
export default class ResponseProgress extends mixins(ProgressMixin) {
  mounted() {
    this.$assistant.on('request.progress', this.onProgress);
  }
}
</script>

<style scoped></style>
