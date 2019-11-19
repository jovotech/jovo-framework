/**
 * CarouselBrowserTile class. CarouselBrowser item
 */
import { CollectionItem } from './CollectionItem';
export type UrlTypeHint = 'URL_TYPE_HINT_UNSPECIFIED' | 'AMP_CONTENT';
export interface OpenUrlAction {
  urlTypeHint: UrlTypeHint;
  url?: string;
}
export class CarouselBrowseTile extends CollectionItem {
  static urlTypeHints = ['URL_TYPE_HINT_UNSPECIFIED', 'AMP_CONTENT'];
  openUrlAction: OpenUrlAction = {
    urlTypeHint: 'URL_TYPE_HINT_UNSPECIFIED',
  };
  footer?: string;
  /**
   * Constructor
   * @param {CarouselBrowseTile} item
   */
  constructor(item?: CarouselBrowseTile) {
    super(item);

    if (item) {
      if (item.title) {
        this.footer = item.footer;
      }

      if (item.openUrlAction) {
        if (item.openUrlAction.url) {
          this.openUrlAction.url = item.openUrlAction.url;
        }

        if (item.openUrlAction.urlTypeHint) {
          this.openUrlAction.urlTypeHint = item.openUrlAction.urlTypeHint;
        }
      }
    }
  }

  /**
   * Sets footer of the list
   * @param {string} footer
   * @return {CarouselBrowseTile}
   */
  setFooter(footer: string) {
    if (!footer) {
      throw new Error('footer cannot be empty');
    }
    this.footer = footer;
    return this;
  }

  /**
   * Sets openUrlAction of the list
   * @param {string} openUrlAction
   * @return {CarouselBrowseTile}
   */
  setOpenUrlAction(openUrlAction: OpenUrlAction) {
    this.openUrlAction = openUrlAction;
    return this;
  }

  /**
   * Sets url type hint
   * @param {string} urlTypeHint
   */
  setUrlTypeHint(urlTypeHint: UrlTypeHint) {
    if (CarouselBrowseTile.urlTypeHints.includes(urlTypeHint)) {
      throw new Error('Valid type hints are: ' + CarouselBrowseTile.urlTypeHints.join(', '));
    }
    this.openUrlAction.urlTypeHint = urlTypeHint;
  }
}
