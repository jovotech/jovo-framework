import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ProgressMixin extends Vue {
  percentage = 0;

  onProgress(event: ProgressEvent) {
    if (event.lengthComputable) {
      const decimalPercent = event.loaded / event.total;
      this.percentage = Math.floor(decimalPercent * 100);
    }
  }
}
