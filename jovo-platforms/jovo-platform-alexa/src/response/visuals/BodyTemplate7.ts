import {Image, ImageShort, PlainText, RichText, Template, TextContent} from './Template';
import {BodyTemplate2} from "./BodyTemplate2";
import {BodyTemplate6} from "./BodyTemplate6";

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export class BodyTemplate7 extends BodyTemplate6 {
/* eslint-enable */

    image?: Image | ImageShort;
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate7';
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

}

