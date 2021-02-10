import { Card } from './Card';
export interface CardImage {
    smallImageUrl?: string;
    largeImageUrl?: string;
}
export declare class StandardCard extends Card {
    title?: string;
    text?: string;
    image: CardImage;
    constructor(standardCard?: {
        title: string;
        text: string;
        image: CardImage;
    });
    /**
     * Sets title of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} title
     * @return {*}
     */
    setTitle(title: string): this;
    /**
     * Sets content of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} text
     * @return {*}
     */
    setText(text: string): this;
    /**
     * Sets content of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} image
     * @return {*}
     */
    setImage(image: CardImage): this;
    setSmallImageUrl(url: string): this;
    setLargeImageUrl(url: string): this;
}
