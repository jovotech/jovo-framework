import { BasicCard } from './BasicCard';
import { CardContent } from './Card';
import { Button } from './Button';

export class ListContent {
    elements?: CardContent[];
    buttons?: Button[];

    constructor(elements: CardContent[], buttons: Button[]) {
        this.elements = elements;
        this.buttons = buttons;
    }
}

export class List extends BasicCard {
    content?: ListContent;

    constructor(content: ListContent) {
        super('list');
        this.content = content;
    }
}
