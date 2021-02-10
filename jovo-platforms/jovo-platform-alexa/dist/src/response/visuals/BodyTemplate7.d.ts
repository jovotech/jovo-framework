import { Image, ImageShort } from './Template';
import { BodyTemplate6 } from './BodyTemplate6';
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export declare class BodyTemplate7 extends BodyTemplate6 {
    image?: Image | ImageShort;
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor();
    /**
     * Sets image main image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setImage(image: string | ImageShort | Image, description?: string): this;
}
