"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
test('test JovoError class', () => {
    const jovoError = new src_1.JovoError('message', 'ERR_CODE', 'module', 'details', 'hint', 'seeMore');
    expect(jovoError.message).toBe('message');
    expect(jovoError.code).toBe('ERR_CODE');
    expect(jovoError.module).toBe('module');
    expect(jovoError.details).toBe('details');
    expect(jovoError.hint).toBe('hint');
    expect(jovoError.seeMore).toBe('seeMore');
});
test('test JovoError ErrorCode', () => {
    const jovoError = new src_1.JovoError('message');
    expect(jovoError.message).toBe('message');
    expect(jovoError.code).toBe(src_1.ErrorCode.ERR);
});
//# sourceMappingURL=JovoError.test.js.map