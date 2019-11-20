export interface Card {
  type: string;
}

export abstract class Card {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  setType(type: string): this {
    this.type = type;
    return this;
  }
}
