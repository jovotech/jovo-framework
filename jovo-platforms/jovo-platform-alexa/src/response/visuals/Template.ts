import _get = require('lodash.get');

interface ImageSource {
  url: string;
  size?: string;
  widthPixels?: number;
  heightPixels?: number;
}

export interface Image {
  contentDescription?: string;
  sources: ImageSource[];
}

export interface ImageShort {
  url: string;
  description?: string;
}

export interface TextContent {
  primaryText: RichText | PlainText;
  secondaryText?: RichText | PlainText;
  tertiaryText?: RichText | PlainText;
}

export interface RichText {
  text: string;
  type: string;
}

export interface PlainText {
  text: string;
  type: string;
}

/**
 * Template base class
 */
export class Template {
  static VISIBILITY_HIDDEN = 'HIDDEN';
  static VISIBILITY_VISIBLE = 'VISIBLE';

  type: string;
  title?: string;
  token?: string;
  backButton: string = Template.VISIBILITY_HIDDEN;
  backgroundImage?: Image | ImageShort;

  /**
   * Constructor
   */
  constructor(type: string) {
    this.type = type;
  }

  /**
   * Sets title of template
   * @param {string} title
   * @return {Template}
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /**
   * Sets token of template
   * @param {string} token
   * @return {Template}
   */
  setToken(token: string) {
    this.token = token;
    return this;
  }

  /**
   * Sets back-button visibility
   * @param {'HIDDEN'|'VISIBLE'} visibility
   * @return {Template}
   */
  setBackButton(visibility: string) {
    const validTypes = [Template.VISIBILITY_HIDDEN, Template.VISIBILITY_VISIBLE];

    if (!validTypes.includes(visibility)) {
      throw new Error('Invalid visibility type');
    }

    this.backButton = visibility;
    return this;
  }

  /**
   * Sets back button to visible
   * @return {this}
   */
  showBackButton() {
    this.backButton = Template.VISIBILITY_VISIBLE;
    return this;
  }

  /**
   * Sets back button to hidden
   * @return {this}
   */
  hideBackButton() {
    this.backButton = Template.VISIBILITY_HIDDEN;
    return this;
  }

  /**
   * Sets background Image
   * @param {*|string} backgroundImage
   * @return {Template}
   */
  setBackgroundImage(backgroundImage: string | ImageShort | Image, description?: string) {
    this.backgroundImage = Template.makeImage(backgroundImage, description);
    return this;
  }

  /**
   * Creates textContent object
   * @param {*} primaryText
   * @param {*} secondaryText
   * @param {*} tertiaryText
   * @return {{}}
   */
  static makeTextContent(
    primaryText: string | RichText | PlainText,
    secondaryText?: string | RichText | PlainText,
    tertiaryText?: string | RichText | PlainText,
  ): TextContent {
    const textContent: TextContent = {
      primaryText:
        typeof primaryText === 'string' ? Template.makeRichText(primaryText) : primaryText,
    };

    if (secondaryText) {
      textContent.secondaryText =
        typeof secondaryText === 'string' ? Template.makeRichText(secondaryText) : secondaryText;
    }
    if (tertiaryText) {
      textContent.tertiaryText =
        typeof tertiaryText === 'string' ? Template.makeRichText(tertiaryText) : tertiaryText;
    }

    return textContent;
  }

  /**
   * Creates rich text object
   * @param {string} text
   * @return {{text: *, type: string}}
   */
  static makeRichText(text: string | RichText): RichText {
    if (typeof text === 'string') {
      return {
        type: 'RichText',
        text,
      };
    }
    return text;
  }

  /**
   * Creates plain text object
   * @param {string} text
   * @return {*}
   */
  static makePlainText(text: string | PlainText): PlainText {
    if (typeof text === 'string') {
      return {
        type: 'PlainText',
        text,
      };
    }
    return text;
  }

  /**
   * Creates image object
   * @param {*} image
   * @param {string} description
   * @return {*}
   */
  static makeImage(image: string | ImageShort | Image, description?: string): Image | ImageShort {
    if (typeof image === 'string') {
      const img: Image = {
        sources: [
          {
            url: image,
          },
        ],
      };

      if (description) {
        img.contentDescription = description;
      }
      return img;
    } else {
      if (_get(image, 'url')) {
        return Template.makeImage(_get(image, 'url'), _get(image, 'description'));
      } else {
        return image;
      }
    }
  }
}
