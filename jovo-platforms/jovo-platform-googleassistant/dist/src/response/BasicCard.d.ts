import { Image } from '../core/Interfaces';
export interface BasicCardImage extends Image {
}
export interface BasicCardButton {
    title: string;
    openUrlAction: {
        url: string;
    };
}
export declare class BasicCard {
    title?: string;
    subtitle?: string;
    formattedText?: string;
    image?: BasicCardImage;
    buttons?: BasicCardButton[];
    imageDisplayOptions?: string;
    constructor(basicCard?: BasicCard);
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setFormattedText(formattedText: string): this;
    setImage(image: BasicCardImage): this;
    addButton(text: string, url: string): this;
    setImageDisplay(imageDisplayOptions?: string): this;
}
