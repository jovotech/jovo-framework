import { Collection } from './Collection';
import { OptionItem } from './OptionItem';
export declare class List extends Collection {
    title?: string;
    constructor(items?: OptionItem[]);
    setTitle(title: string): this;
}
