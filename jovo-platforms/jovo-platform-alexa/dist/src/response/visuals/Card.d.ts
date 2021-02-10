export interface Card {
    type: string;
}
export declare abstract class Card {
    type: string;
    constructor(type: string);
    setType(type: string): this;
}
