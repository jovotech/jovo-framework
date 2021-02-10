"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutopilotResponse_1 = require("../src/core/AutopilotResponse");
process.env.NODE_ENV = 'UNIT_TEST';
describe('test hasSessionEnded()', () => {
    let response;
    beforeEach(() => {
        response = new AutopilotResponse_1.AutopilotResponse();
    });
    test('action contains Listen action', () => {
        response.actions = [
            {
                listen: true,
            },
        ];
        expect(response.hasSessionEnded()).toBe(false);
    });
    test('action contains Redirect action', () => {
        response.actions = [
            {
                redirect: 'test',
            },
        ];
        expect(response.hasSessionEnded()).toBe(false);
    });
    test('action contains Collect action', () => {
        response.actions = [
            {
                collect: {},
            },
        ];
        expect(response.hasSessionEnded()).toBe(false);
    });
    test('action does not contain Listen, Redirect, or Collect action', () => {
        response.actions = [
            {
                say: 'hello World',
            },
        ];
        expect(response.hasSessionEnded()).toBe(true);
    });
});
//# sourceMappingURL=AutopilotResponse.test.js.map