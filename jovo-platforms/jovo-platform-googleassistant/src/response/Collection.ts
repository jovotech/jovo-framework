/**
 * Base class for a carousel or a list.
 */
import {CarouselItem} from "./CarouselItem";

export class Collection {
    items: CarouselItem[];
    /**
     * Constructor
     * @param {*=} items
     */
    constructor(items?: CarouselItem[]) {
        this.items = [];

        if (items) {
            this.items = items;
        }
    }

    /**
     * Adds item to collection
     * @param {OptionItem} item
     */
    addItem(item: CarouselItem) {
        this.items.push(item);
    }
}
