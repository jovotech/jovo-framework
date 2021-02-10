"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./../src/App");
let appBase;
jest.setTimeout(250);
process.env.NODE_ENV = 'UNIT_TEST';
appBase = new App_1.App();
test('test onRequest', (done) => {
    appBase.onRequest(() => {
        done();
    });
    appBase.emit('request');
});
test('test onResponse', (done) => {
    appBase.onResponse(() => {
        done();
    });
    appBase.emit('response');
});
test('test onFail', (done) => {
    appBase.onFail(() => {
        done();
    });
    appBase.emit('fail');
});
test('test onError', (done) => {
    appBase.onError(() => {
        done();
    });
    appBase.emit('fail');
});
//# sourceMappingURL=app.test.js.map