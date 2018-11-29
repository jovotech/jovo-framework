import {Image, ImageShort, PlainText, RichText, Template, TextContent} from './Template';


export interface ListItem {
    token: string;
    image: Image | ImageShort;
    textContent: TextContent;
}


/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export class ListTemplate1 extends Template {
/* eslint-enable */

    listItems: ListItem[] = [];
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super('ListTemplate1');
    }

    addItem(listItem: ListItem): this;
    addItem(token: string, image: string | Image | ImageShort, primaryText?: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this;
    addItem(tokenOrListItem: string | ListItem, image?: string | Image | ImageShort, primaryText?: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this {
        if (typeof tokenOrListItem === 'string') {

            if (!image) {
                throw new Error('Image is needed');
            }

            if (!primaryText) {
                throw new Error('At least primaryText is needed');
            }

            this.listItems.push({
                token: tokenOrListItem,
                image: Template.makeImage(image),
                textContent: Template.makeTextContent(
                    primaryText,
                    secondaryText,
                    tertiaryText
                )
            });
        } else {
            this.listItems.push(tokenOrListItem);
        }
        return this;
    }

    /**
     * Sets items
     * @param {array} items
     * @return {ListTemplate1}
     */
    setItems(items: ListItem[]) {
        this.listItems = items;
        return this;
    }
}

