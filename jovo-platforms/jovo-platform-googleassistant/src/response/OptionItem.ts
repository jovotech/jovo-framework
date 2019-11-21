/**
 * OptionItem for collections
 */
import { CarouselItem } from './CarouselItem';
export interface OptionInfo {
  key: string;
  synonyms: string[];
}
export class OptionItem extends CarouselItem {
  optionInfo: OptionInfo = {
    key: '',
    synonyms: [],
  };
  /**
   * constructor
   * @param {OptionItem=} item
   */
  constructor(item?: OptionItem) {
    super(item);
    this.optionInfo = {
      key: '',
      synonyms: [],
    };

    if (item) {
      if (item.optionInfo) {
        this.optionInfo = item.optionInfo;
      }
    }
  }

  /**
   * Sets key of item
   * @param {string} key
   * @return {OptionItem}
   */
  setKey(key: string) {
    this.optionInfo.key = key;
    return this;
  }

  /**
   * Adds synonym
   * @param {string} synonym
   * @return {OptionItem}
   */
  addSynonym(synonym: string) {
    this.optionInfo.synonyms.push(synonym);
    return this;
  }
}
