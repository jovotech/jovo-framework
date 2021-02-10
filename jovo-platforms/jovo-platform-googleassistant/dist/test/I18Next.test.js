"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../src");
process.env.NODE_ENV = 'UNIT_TEST';
let p;
let t;
const i18NextData = {
    translation: {
        WELCOME: 'Welcome_Default',
        GOODBYE: ['Goodbye_Default_1', 'Goodbye_Default_2'],
        DEFAULT: 'Default',
        OBJECT: {
            key: 'Value_Default',
        },
    },
    GoogleAction: {
        translation: {
            WELCOME: 'Welcome_GoogleAssistant',
            GOODBYE: ['Goodbye_GoogleAssistant_1', 'Goodbye_GoogleAssistant_2'],
            EMPTY: '',
            OBJECT: {
                key: 'Value_GoogleAssistant',
            },
        },
    },
};
beforeEach(() => {
    p = new src_1.GoogleAssistant();
    t = p.makeTestSuite();
});
describe('Function jovo.t()', () => {
    describe('without platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('WELCOME') === 'Welcome_Default') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('UNDEFINED') === 'UNDEFINED') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for object', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('OBJECT').key === 'Value_Default') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    const speech = this.t('GOODBYE');
                    if (speech.indexOf('Goodbye_Default_1') + speech.indexOf('Goodbye_Default_2') >= 0) {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
    });
    describe('with platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('WELCOME') === `Welcome_${p.constructor.name}`) {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for empty string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('EMPTY') === '') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('DEFAULT') === 'Default') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for object', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.t('OBJECT').key === 'Value_GoogleAssistant') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    const speech = this.t('GOODBYE');
                    if (speech.indexOf(`Goodbye_${p.constructor.name}_1`) +
                        speech.indexOf(`Goodbye_${p.constructor.name}_2`) >=
                        0) {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
    });
});
describe('Function $cms.t()', () => {
    describe('without platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('WELCOME') === 'Welcome_Default') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('UNDEFINED') === 'UNDEFINED') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for object', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('OBJECT').key === 'Value_Default') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    const speech = this.$cms.t('GOODBYE');
                    if (speech.indexOf('Goodbye_Default_1') + speech.indexOf('Goodbye_Default_2') >= 0) {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
    });
    describe('with platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('WELCOME') === `Welcome_${p.constructor.name}`) {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for empty string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('EMPTY') === '') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('DEFAULT') === 'Default') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for object', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    if (this.$cms.t('OBJECT').key === 'Value_GoogleAssistant') {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    const speech = this.$cms.t('GOODBYE');
                    if (speech.indexOf(`Goodbye_${p.constructor.name}_1`) +
                        speech.indexOf(`Goodbye_${p.constructor.name}_2`) >=
                        0) {
                        done();
                    }
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
    });
});
describe('Function $speech.t()', () => {
    describe('without platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('WELCOME'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Welcome_Default')).toBe(true);
                done();
            });
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('UNDEFINED'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('UNDEFINED')).toBe(true);
                done();
            });
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('GOODBYE'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell(['Goodbye_Default_1', 'Goodbye_Default_2'])).toBe(true);
                done();
            });
        });
    });
    describe('with platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('WELCOME'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell(`Welcome_${p.constructor.name}`)).toBe(true);
                done();
            });
        });
        test('for empty string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('EMPTY'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('')).toBe(true);
                done();
            });
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('DEFAULT'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Default')).toBe(true);
                done();
            });
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.t('GOODBYE'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell([
                    `Goodbye_${p.constructor.name}_1`,
                    `Goodbye_${p.constructor.name}_2`,
                ])).toBe(true);
                done();
            });
        });
    });
});
describe('Function $speech.addT()', () => {
    describe('without platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('WELCOME'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Welcome_Default')).toBe(true);
                done();
            });
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('UNDEFINED'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('UNDEFINED')).toBe(true);
                done();
            });
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': {
                            translation: i18NextData.translation,
                        },
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('GOODBYE'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell(['Goodbye_Default_1', 'Goodbye_Default_2'])).toBe(true);
                done();
            });
        });
    });
    describe('with platform specific responses', () => {
        test('for string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('WELCOME'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell(`Welcome_${p.constructor.name}`)).toBe(true);
                done();
            });
        });
        test('for empty string', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('EMPTY'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('')).toBe(true);
                done();
            });
        });
        test('for undefined key', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('DEFAULT'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Default')).toBe(true);
                done();
            });
        });
        test('for string array', async (done) => {
            const app = new jovo_framework_1.App({
                i18n: {
                    resources: {
                        'en-US': i18NextData,
                    },
                },
            });
            app.use(p);
            app.setHandler({
                LAUNCH() {
                    this.tell(this.$speech.addT('GOODBYE'));
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell([
                    `Goodbye_${p.constructor.name}_1`,
                    `Goodbye_${p.constructor.name}_2`,
                ])).toBe(true);
                done();
            });
        });
    });
});
//# sourceMappingURL=I18Next.test.js.map