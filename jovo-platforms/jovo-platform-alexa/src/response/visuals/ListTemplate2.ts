import { ListTemplate1 } from './ListTemplate1';

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export class ListTemplate2 extends ListTemplate1 {
  /* eslint-enable */

  /**
   * Constructor
   * Sets type of template to 'BodyTemplate1'
   */
  constructor() {
    super();
    this.type = 'ListTemplate2';

    // In ListTemplate1 item images are optional, but in ListTemplate2 they are required
    this.itemImageRequired = true;
  }
}
