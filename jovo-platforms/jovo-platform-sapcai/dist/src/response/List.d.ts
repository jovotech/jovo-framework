import { BasicCard } from './BasicCard';
import { CardContent } from './Card';
import { Button } from './Button';
export declare class ListContent {
    elements?: CardContent[];
    buttons?: Button[];
    constructor(elements: CardContent[], buttons: Button[]);
}
export declare class List extends BasicCard {
    content?: ListContent;
    constructor(content: ListContent);
}
