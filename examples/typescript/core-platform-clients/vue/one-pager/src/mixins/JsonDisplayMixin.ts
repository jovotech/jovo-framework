import { Component, Prop, Vue } from 'vue-property-decorator';
import set from 'lodash.set';
import get from 'lodash.get';

@Component
export default class JsonDisplayMixin extends Vue {
  content: any = {};

  @Prop({
    required: false,
    type: Array,
    default: () => {
      return [];
    },
  })
  excludedProperties!: string[];

  @Prop({ required: false, default: '[ HIDDEN ]' })
  replaceValue!: any;

  get isVisible() {
    return Object.keys(this.content).length > 0;
  }

  getFilteredCopy(obj: any): any {
    const copy = JSON.parse(JSON.stringify(obj));
    this.excludedProperties.forEach((excludedProp: string) => {
      if (get(copy, excludedProp)) {
        set(copy, excludedProp, this.replaceValue);
      }
    });
    return copy;
  }
}
