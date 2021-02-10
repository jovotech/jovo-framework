import { Image, ImageShort } from './Template';
import { BodyTemplate1 } from './BodyTemplate1';
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export declare class BodyTemplate6 extends BodyTemplate1 {
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor();
    /**
     * Sets full screen image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate6}
     */
    setFullScreenImage(image: string | ImageShort | Image, description?: string): this;
}
