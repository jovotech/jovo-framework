"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const jovo_platform_alexa_1 = require("jovo-platform-alexa");
const jovo_platform_googleassistant_1 = require("jovo-platform-googleassistant");
jest.setTimeout(550);
process.env.NODE_ENV = 'UNIT_TEST';
let app;
beforeEach(() => {
    app = new jovo_framework_1.App();
    app.use(new jovo_platform_alexa_1.Alexa(), new jovo_platform_googleassistant_1.GoogleAssistant());
});
describe('test setPlatformHandler', () => {
    test('setPlatformHandler with valid platform and single handler', () => {
        var _a, _b, _c, _d, _e, _f;
        app.setPlatformHandler('Alexa', {
            LAUNCH() {
                //
            },
            State: {
                Intent() {
                    //
                },
            },
        });
        expect((_c = (_b = (_a = app.config.plugin) === null || _a === void 0 ? void 0 : _a.Alexa) === null || _b === void 0 ? void 0 : _b.handlers) === null || _c === void 0 ? void 0 : _c.LAUNCH).toBeDefined();
        expect((_f = (_e = (_d = app.config.plugin) === null || _d === void 0 ? void 0 : _d.Alexa) === null || _e === void 0 ? void 0 : _e.handlers) === null || _f === void 0 ? void 0 : _f.State).toBeDefined();
    });
    test('setPlatformHandler with valid platform and multiple handlers', () => {
        var _a, _b, _c, _d, _e, _f;
        app.setPlatformHandler('GoogleAssistant', {
            State: {
                Intent() {
                    //
                },
            },
        }, {
            State2: {
                Intent() {
                    //
                },
            },
        });
        expect((_c = (_b = (_a = app.config.plugin) === null || _a === void 0 ? void 0 : _a.GoogleAssistant) === null || _b === void 0 ? void 0 : _b.handlers) === null || _c === void 0 ? void 0 : _c.State).toBeDefined();
        expect((_f = (_e = (_d = app.config.plugin) === null || _d === void 0 ? void 0 : _d.GoogleAssistant) === null || _e === void 0 ? void 0 : _e.handlers) === null || _f === void 0 ? void 0 : _f.State2).toBeDefined();
    });
    test('setPlatformHandler with invalid platform', () => {
        expect(() => app.setPlatformHandler('undefined', {})).toThrow(jovo_framework_1.JovoError);
    });
});
//# sourceMappingURL=handler.test.js.map