/**
 * Carousel UI element for devices with SCREEN_OUTPUT
 * Items can be selected via voice or via touch
 */
import {Collection} from "./Collection";
import {CarouselItem} from "./CarouselItem";

export class Carousel extends Collection {
    /**
     * Constructor
     * @param {Array<CarouselItem>=} items
     */
    constructor(items?: CarouselItem[]) {
        super(items);
    }
}
