import { BasicCard } from './BasicCard';
import { Button } from "./Button";

export class CardContent {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    buttons?: Button[];
}

export class Card extends BasicCard {
    content?: CardContent;

    constructor(content: CardContent) {
        super('card');
        this.content = content;
    }
}
