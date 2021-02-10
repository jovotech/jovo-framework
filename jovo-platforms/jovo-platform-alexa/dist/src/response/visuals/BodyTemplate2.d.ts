import { Image, ImageShort } from './Template';
import { BodyTemplate1 } from './BodyTemplate1';
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export declare class BodyTemplate2 extends BodyTemplate1 {
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
    /**
     * Sets image on the right side
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setRightImage(image: string | ImageShort | Image, description?: string): this;
}
