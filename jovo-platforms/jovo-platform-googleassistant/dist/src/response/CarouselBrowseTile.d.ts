import { CollectionItem } from './CollectionItem';
export declare type UrlTypeHint = 'URL_TYPE_HINT_UNSPECIFIED' | 'AMP_CONTENT';
export interface OpenUrlAction {
    urlTypeHint: UrlTypeHint;
    url?: string;
}
export declare class CarouselBrowseTile extends CollectionItem {
    static urlTypeHints: string[];
    openUrlAction: OpenUrlAction;
    footer?: string;
    constructor(item?: CarouselBrowseTile);
    setFooter(footer: string): this;
    setOpenUrlAction(openUrlAction: OpenUrlAction): this;
    setUrlTypeHint(urlTypeHint: UrlTypeHint): void;
}
