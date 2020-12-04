import _merge = require('lodash.merge');
import { Card, Image, ImageFill, Link, UrlHint } from '../core/Interfaces';

/**
 * Basic card UI element
 */
export class BasicCard implements Card {
  title!: string;
  subtitle?: string;
  text!: string;
  image?: Image;
  button?: Link;
  imageFill?: ImageFill;

  /**
   * Constructor
   * @param {BasicCard=} basicCard
   */
  constructor(basicCard?: BasicCard) {
    if (basicCard) {
      _merge(this, basicCard);
    }
  }

  /**
   * Sets title of item
   * @param {string} title
   * @return {BasicCard}
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /**
   * Sets subtitle of item
   * @param {string} subtitle
   * @return {BasicCard}
   */
  setSubtitle(subtitle: string) {
    this.subtitle = subtitle;
    return this;
  }

  /**
   * Sets body text of item
   * @deprecated Please use setText
   * @param {string} formattedText
   * @return {BasicCard}
   */
  setFormattedText(formattedText: string) {
    return this.setText(formattedText);
  }

  /**
   * Sets body text of item
   * @param {string} text
   * @return {BasicCard}
   */
  setText(text: string) {
    this.text = text;
    return this;
  }

  /**
   * Sets image of element
   * @param {Image} image
   * @return {BasicCard}
   */
  setImage(image: Image) {
    this.image = image;
    return this;
  }

  /**
   * Adds button to basic card
   *
   * @param {string} text
   * @param {string} url
   * @param {UrlHint} hint
   * @return {BasicCard}
   */
  addButton(text: string, url: string, hint: UrlHint = 'LINK_UNSPECIFIED') {
    this.button = {
      name: text,
      open: {
        hint,
        url,
      },
    };
    return this;
  }

  /**
   * Sets the image display option
   * @deprecated Please use setImageFill
   * @param {string} imageDisplayOptions display option
   * @return {BasicCard}
   */
  setImageDisplay(imageDisplayOptions = 'UNSPECIFIED') {
    return this.setImageFill(imageDisplayOptions as ImageFill);
  }

  setImageFill(imageFill: ImageFill = 'UNSPECIFIED') {
    if (!['DEFAULT', 'WHITE', 'CROPPED'].includes(imageFill)) {
      throw new Error('Image Display Option must be one of DEFAULT, WHITE, CROPPED');
    }
    this.imageFill = imageFill;
    return this;
  }
}
