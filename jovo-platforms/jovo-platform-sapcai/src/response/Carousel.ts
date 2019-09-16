import { BasicCard } from './BasicCard';
import { CardContent } from './Card';


export class Carousel extends BasicCard {
    content?: CardContent[];

    constructor(items: CardContent[]) {
        super('carousel');
        this.content = items;
    }
}
