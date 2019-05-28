/**
 * Browsing Carousel UI element for devices with SCREEN_OUTPUT
 */
import {Collection} from "./Collection";
import {CarouselBrowseTile} from "./CarouselBrowseTile";

export class CarouselBrowse extends Collection {
    /**
     * Constructor
     * @param {Array<OptionItem>=} items
     */
    constructor(items?: CarouselBrowseTile[]) {
        super(items);
    }
}
