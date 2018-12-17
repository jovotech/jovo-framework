import {Image, ImageShort, PlainText, RichText, Template, TextContent} from './Template';
import {BodyTemplate1} from "./BodyTemplate1";

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export class BodyTemplate2 extends BodyTemplate1 {
/* eslint-enable */

    image?: Image | ImageShort;

    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate2';
    }

    /**
     * Sets image main image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setImage(image:string | ImageShort | Image, description?: string) {
        this.image = Template.makeImage(image, description);
        return this;
    }

    /**
     * Sets image on the right side
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setRightImage(image:string | ImageShort | Image, description?: string) {
        return this.setImage(image, description);
    }

}

