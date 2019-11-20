import { Card } from './Card';

export class SimpleCard extends Card {
  title?: string;
  content?: string;

  constructor(simpleCard?: { title: string; content: string }) {
    super('Simple');

    if (simpleCard) {
      Object.assign(this, simpleCard);
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
   * @param {string} content
   * @return {*}
   */
  setContent(content: string) {
    this.content = content;
    return this;
  }
}
