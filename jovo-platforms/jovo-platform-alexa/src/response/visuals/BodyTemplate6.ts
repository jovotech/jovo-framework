import { Image, ImageShort, PlainText, RichText, Template, TextContent } from './Template';
import { BodyTemplate1 } from './BodyTemplate1';

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export class BodyTemplate6 extends BodyTemplate1 {
  /* eslint-enable */

  /**
   * Constructor
   * Sets type of template to 'BodyTemplate1'
   */
  constructor() {
    super();
    this.type = 'BodyTemplate6';
  }

  /**
   * Sets full screen image
   * @param {*} image
   * @param {string} description
   * @return {BodyTemplate6}
   */
  setFullScreenImage(image: string | ImageShort | Image, description?: string) {
    return this.setBackgroundImage(image, description);
  }
}
