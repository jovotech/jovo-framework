import { CarouselItem } from './CarouselItem';
export declare class Collection {
    items: CarouselItem[];
    constructor(items?: CarouselItem[]);
    addItem(item: CarouselItem): void;
}
