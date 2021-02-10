import { CarouselItem } from './CarouselItem';
export interface OptionInfo {
    key: string;
    synonyms: string[];
}
export declare class OptionItem extends CarouselItem {
    optionInfo: OptionInfo;
    constructor(item?: OptionItem);
    setKey(key: string): this;
    addSynonym(synonym: string): this;
}
