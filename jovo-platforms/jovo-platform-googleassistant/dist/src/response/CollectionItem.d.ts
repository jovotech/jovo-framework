import { Image } from '../core/Interfaces';
export interface CollectionItemImage extends Image {
}
export declare class CollectionItem {
    title?: string;
    description?: string;
    image?: CollectionItemImage;
    constructor(item?: CollectionItem);
    setTitle(title: string): this;
    setDescription(description: string): this;
    setImage(image: CollectionItemImage): this;
}
