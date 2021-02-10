import { Card, Image, ImageFill, Link, UrlHint } from '../core/Interfaces';
export declare class BasicCard implements Card {
    title: string;
    subtitle?: string;
    text: string;
    image?: Image;
    button?: Link;
    imageFill?: ImageFill;
    constructor(basicCard?: BasicCard);
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setFormattedText(formattedText: string): this;
    setText(text: string): this;
    setImage(image: Image): this;
    addButton(text: string, url: string, hint?: UrlHint): this;
    setImageDisplay(imageDisplayOptions?: string): this;
    setImageFill(imageFill?: ImageFill): this;
}
