
export interface BasicCard {
    type: string;
}

export abstract class BasicCard {
    type: string;

    constructor(type: string) {
        this.type = type;
    }

    setType(type: string): this {
        this.type = type;
        return this;
    }
}
