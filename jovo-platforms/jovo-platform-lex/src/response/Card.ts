import _merge = require('lodash.merge');
import { Button } from './Button';

export interface CardContent {
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  attachmentLinkUrl?: string;
  buttons?: Button[];
}
/**
 * Basic card UI element
 */
export class Card {
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  attachmentLinkUrl?: string;
  buttons?: Button[];

  /**
   * Constructor
   * @param {Card=} card
   */
  constructor(content: CardContent) {
    if (content) {
      _merge(this, content);
    }
  }
}
