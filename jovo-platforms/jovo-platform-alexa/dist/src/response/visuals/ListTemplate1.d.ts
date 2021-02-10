import { Image, ImageShort, PlainText, RichText, Template, TextContent } from './Template';
export interface ListItem {
    token: string;
    image?: Image | ImageShort;
    textContent: TextContent;
}
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export declare class ListTemplate1 extends Template {
    listItems: ListItem[];
    protected itemImageRequired: boolean;
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor();
    addItem(listItem: ListItem): this;
    addItem(token: string, image?: string | Image | ImageShort, primaryText?: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this;
    /**
     * Sets items
     * @param {array} items
     * @return {ListTemplate1}
     */
    setItems(items: ListItem[]): this;
}
