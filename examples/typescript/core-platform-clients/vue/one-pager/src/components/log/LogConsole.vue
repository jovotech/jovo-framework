<template>
  <div class="log-console" ref="container">
    <pre class="content" v-html="content" v-if="content.length > 0"></pre>
    <div class="no-content" v-else>
      <span>empty</span>
    </div>
  </div>
</template>

<script lang="ts">
import { LoggerEvents, LogPayload } from 'jovo-client-web-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'log-console',
})
export default class LogConsole extends Vue {
  content = '';

  mounted() {
    this.$assistant.on(LoggerEvents.Log, this.onLog);
  }

  private onLog(payload: LogPayload) {
    const prepend = `[${this.formatTime(new Date())}] `;
    const tagContent = prepend + payload.content + '\n';
    this.content += tagContent;
  }

  private formatTime(date: Date): string {
    const hours = date
      .getHours()
      .toString()
      .padStart(2, '0');
    const minutes = date
      .getMinutes()
      .toString()
      .padStart(2, '0');
    const seconds = date
      .getSeconds()
      .toString()
      .padStart(2, '0');
    const milliseconds = date
      .getMilliseconds()
      .toString()
      .padStart(4, '0');
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  }
}
</script>

<style lang="scss" scoped>
.log-console {
  background: #2c3e50;
  color: #ddd;
  padding: 10px;

  & .content {
    margin: 0;
  }

  & .no-content {
    color: #999;
  }
}
</style>
