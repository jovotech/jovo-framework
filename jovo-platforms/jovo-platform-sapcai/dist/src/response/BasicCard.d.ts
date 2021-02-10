export interface BasicCard {
    type: string;
}
export declare abstract class BasicCard {
    type: string;
    constructor(type: string);
    setType(type: string): this;
}
