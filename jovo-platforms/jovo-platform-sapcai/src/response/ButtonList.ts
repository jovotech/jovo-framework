import { BasicCard } from './BasicCard';
import { CardContent } from './Card';


export class ButtonList extends BasicCard {
    content?: CardContent;

    constructor(content: CardContent) {
        super('buttons');
        this.content = content;
    }
}
