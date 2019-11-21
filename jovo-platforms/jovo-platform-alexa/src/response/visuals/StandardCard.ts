import { Card } from './Card';

export interface CardImage {
  smallImageUrl?: string;
  largeImageUrl?: string;
}

export class StandardCard extends Card {
  title?: string;
  text?: string;
  image: CardImage = {};

  constructor(standardCard?: { title: string; text: string; image: CardImage }) {
    super('Standard');

    if (standardCard) {
      Object.assign(this, {}, standardCard);
    }
  }

  /**
   * Sets title of card
   * Total number of characters (title and content combined) cannot exceed 8000
   * @param {string} title
   * @return {*}
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /**
   * Sets content of card
   * Total number of characters (title and content combined) cannot exceed 8000
   * @param {string} text
   * @return {*}
   */
  setText(text: string) {
    this.text = text;
    return this;
  }

  /**
   * Sets content of card
   * Total number of characters (title and content combined) cannot exceed 8000
   * @param {string} image
   * @return {*}
   */
  setImage(image: CardImage) {
    this.image = image;
    return this;
  }

  setSmallImageUrl(url: string) {
    this.image.smallImageUrl = url;
    return this;
  }

  setLargeImageUrl(url: string) {
    this.image.largeImageUrl = url;
    return this;
  }
}
