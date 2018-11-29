/**
 * List UI element for devices with SCREEN_OUTPUT
 * Items can be selected via voice or via touch
 */
import {Collection} from "./Collection";
import {OptionItem} from "./OptionItem";

export class List extends Collection {
    title?: string;
    /**
     * Constructor
     * @param {Array<OptionItem>=} items
     */
    constructor(items?: OptionItem[]) {
        super(items);
    }

    /**
     * Sets title of the list
     * @param {string} title
     * @return {List}
     */
    setTitle(title: string) {
        this.title = title;
        return this;
    }
}
