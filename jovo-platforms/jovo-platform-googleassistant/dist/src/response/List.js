"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("./Collection");
class List extends Collection_1.Collection {
    constructor(items) {
        super(items);
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
}
exports.List = List;
//# sourceMappingURL=List.js.map