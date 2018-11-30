/**
 * CarouselItem Class
 */

export interface CollectionItemImage {
    url: string;
    accessibilityText: string;
    width?: number;
    height?: number;
}


export class CollectionItem {

    title?: string;
    description?: string;
    image?: CollectionItemImage;

    /**
     * constructor
     * @param {OptionItem=} item
     */
    constructor(item?: CollectionItem) {
        if (item) {
            if (item.title) {
                this.title = item.title;
            }
            if (item.description) {
                this.description = item.description;
            }
            if (item.image) {
                this.image = item.image;
            }
        }
    }

    /**
     * Sets title of item
     * @param {string} title
     * @return {List}
     */
    setTitle(title: string) {
        this.title = title;
        return this;
    }

    /**
     * Sets description of item
     * @param {string} description
     * @return {List}
     */
    setDescription(description: string) {
        this.description = description;
        return this;
    }

    /**
     * Sets image of element
     * @param {BasicCardImage} image
     * @return {OptionItem}
     */
    setImage(image: CollectionItemImage) {
        this.image = image;
        return this;
    }
}
