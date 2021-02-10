"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const LindenbaumCore_1 = require("../../src/modules/LindenbaumCore");
process.env.NODE_ENV = 'UNIT_TEST';
describe('test creation of final response from $output object', () => {
    const lindenbaumCore = new LindenbaumCore_1.LindenbaumCore(); // doesn't store any data, doesn't have to be reset
    let lindenbaumBot;
    beforeEach(() => {
        lindenbaumBot = {
            $output: {
                Lindenbaum: [],
            },
            $response: new src_1.LindenbaumResponse(),
            $request: new src_1.LindenbaumRequest().setUserId('000'),
        }; // hack so we don't have to implement whole interface
    });
    test('ask', () => {
        lindenbaumBot.$output.ask = {
            speech: 'Hello World',
            reprompt: 'Hello World Reprompt',
        };
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        expect(response.responses.find((value) => value['/call/say'])).toEqual({
            '/call/say': {
                dialogId: '000',
                text: '<speak>Hello World</speak>',
                language: '',
                bargeIn: false,
            },
        });
    });
    test('tell', () => {
        lindenbaumBot.$output.tell = {
            speech: 'Hello World',
        };
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        expect(response.responses.find((value) => value['/call/say'])).toEqual({
            '/call/say': {
                dialogId: '000',
                text: '<speak>Hello World</speak>',
                language: '',
                bargeIn: false,
            },
        });
        expect(response.responses.find((value) => value['/call/drop'])).toEqual({
            '/call/drop': {
                dialogId: '000',
            },
        });
    });
    test('bridge', () => {
        lindenbaumBot.$output.Lindenbaum = [
            {
                '/call/bridge': {
                    dialogId: '000',
                    headNumber: 'test',
                    extensionLength: 0,
                },
            },
        ];
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        expect(response.responses.find((value) => value['/call/bridge'])).toEqual({
            '/call/bridge': {
                dialogId: '000',
                headNumber: 'test',
                extensionLength: 0,
            },
        });
    });
    test('forward', () => {
        lindenbaumBot.$output.Lindenbaum = [
            {
                '/call/forward': {
                    dialogId: '000',
                    destinationNumber: 'test',
                },
            },
        ];
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        expect(response.responses.find((value) => value['/call/forward'])).toEqual({
            '/call/forward': {
                dialogId: '000',
                destinationNumber: 'test',
            },
        });
    });
    test('data', () => {
        lindenbaumBot.$output.Lindenbaum = [
            {
                '/call/data': {
                    dialogId: '000',
                    key: 'test',
                    value: 'testValue',
                },
            },
        ];
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        expect(response.responses.find((value) => value['/call/data'])).toEqual({
            '/call/data': {
                dialogId: '000',
                key: 'test',
                value: 'testValue',
            },
        });
    });
    /**
     * The order HAS to be SayResponse (speech output) before Bridge-, Forward-
     */
    test('speech output before forward/bridge etc.', () => {
        lindenbaumBot.$output.tell = {
            speech: 'Hello World',
        };
        lindenbaumBot.$output.Lindenbaum = [
            {
                '/call/forward': {
                    dialogId: '000',
                    destinationNumber: 'test',
                },
            },
            {
                '/call/bridge': {
                    dialogId: '000',
                    headNumber: 'test',
                    extensionLength: 1,
                },
            },
        ];
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        const sayIndex = response.responses.findIndex((value) => value['/call/say']);
        const bridgeIndex = response.responses.findIndex((value) => value['/call/bridge']);
        const forwardIndex = response.responses.findIndex((value) => value['/call/forward']);
        expect(sayIndex).toBeLessThan(bridgeIndex);
        expect(sayIndex).toBeLessThan(forwardIndex);
    });
    test('data output before speech output', () => {
        lindenbaumBot.$output.tell = {
            speech: 'Hello World',
        };
        lindenbaumBot.$output.Lindenbaum = [
            {
                '/call/data': {
                    dialogId: '000',
                    key: 'test',
                    value: 'testValue',
                },
            },
        ];
        lindenbaumCore.output(lindenbaumBot);
        const response = lindenbaumBot.$response;
        const sayIndex = response.responses.findIndex((value) => value['/call/say']);
        const dataIndex = response.responses.findIndex((value) => value['/call/data']);
        expect(dataIndex).toBeLessThan(sayIndex);
    });
});
//# sourceMappingURL=Output.test.js.map