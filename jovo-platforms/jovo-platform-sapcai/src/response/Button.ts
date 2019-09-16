
import _merge = require('lodash.merge');

export class Button {
    title?: string;
    value?: string;
    type?: string;

    constructor(title: string, value: string, type?: string) {
        this.title = title;
        this.value = value;
        this.type = type;
    }
}
