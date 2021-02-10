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
export declare class Template {
    static VISIBILITY_HIDDEN: string;
    static VISIBILITY_VISIBLE: string;
    type: string;
    title?: string;
    token?: string;
    backButton: string;
    backgroundImage?: Image | ImageShort;
    /**
     * Constructor
     */
    constructor(type: string);
    /**
     * Sets title of template
     * @param {string} title
     * @return {Template}
     */
    setTitle(title: string): this;
    /**
     * Sets token of template
     * @param {string} token
     * @return {Template}
     */
    setToken(token: string): this;
    /**
     * Sets back-button visibility
     * @param {'HIDDEN'|'VISIBLE'} visibility
     * @return {Template}
     */
    setBackButton(visibility: string): this;
    /**
     * Sets back button to visible
     * @return {this}
     */
    showBackButton(): this;
    /**
     * Sets back button to hidden
     * @return {this}
     */
    hideBackButton(): this;
    /**
     * Sets background Image
     * @param {*|string} backgroundImage
     * @return {Template}
     */
    setBackgroundImage(backgroundImage: string | ImageShort | Image, description?: string): this;
    /**
     * Creates textContent object
     * @param {*} primaryText
     * @param {*} secondaryText
     * @param {*} tertiaryText
     * @return {{}}
     */
    static makeTextContent(primaryText: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): TextContent;
    /**
     * Creates rich text object
     * @param {string} text
     * @return {{text: *, type: string}}
     */
    static makeRichText(text: string | RichText): RichText;
    /**
     * Creates plain text object
     * @param {string} text
     * @return {*}
     */
    static makePlainText(text: string | PlainText): PlainText;
    /**
     * Creates image object
     * @param {*} image
     * @param {string} description
     * @return {*}
     */
    static makeImage(image: string | ImageShort | Image, description?: string): Image | ImageShort;
}
export {};
