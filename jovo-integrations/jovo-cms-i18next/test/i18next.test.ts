import * as i18nData from './i18n/en-US.json';
import { I18Next } from '../src';
import { HandleRequest, JovoRequest } from 'jovo-core';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { App, ExpressJS } from 'jovo-framework';

describe('constructor', () => {
    test('without config', () => {
        const i18n = new I18Next();
        expect(i18n.config.filesDir).toEqual('./i18n');
    });

    test('with config', () => {
        const i18n = new I18Next({ filesDir: '../test' });
        expect(i18n.config.filesDir).toEqual('../test');
    });
});

describe('Function jovo.t()', () => {
    describe('without platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.t('WELCOME') === 'Welcome_Default') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.t('UNDEFINED') === 'UNDEFINED') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            const speech = this.t('GOODBYE');
                            if (speech.indexOf('Goodbye_Default_1') + speech.indexOf('Goodbye_Default_2') >= 0) {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });
            });
        }
    });

    describe('with platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.t('WELCOME') === `Welcome_${p.constructor.name}`) {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for empty string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.t('EMPTY') === '') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.t('DEFAULT') === 'Default') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            const speech = this.t('GOODBYE');
                            if (speech.indexOf(`Goodbye_${p.constructor.name}_1`) + speech.indexOf(`Goodbye_${p.constructor.name}_2`) >= 0) {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });
            });
        }
    });
});

describe('Function $cms.t()', () => {
    describe('without platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.$cms.t('WELCOME') === 'Welcome_Default') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.$cms.t('UNDEFINED') === 'UNDEFINED') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            const speech = this.$cms.t('GOODBYE');
                            if (speech.indexOf('Goodbye_Default_1') + speech.indexOf('Goodbye_Default_2') >= 0) {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });
            });
        }
    });

    describe('with platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.$cms.t('WELCOME') === `Welcome_${p.constructor.name}`) {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for empty string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.$cms.t('EMPTY') === '') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            if (this.$cms.t('DEFAULT') === 'Default') {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            const speech = this.$cms.t('GOODBYE');
                            if (speech.indexOf(`Goodbye_${p.constructor.name}_1`) + speech.indexOf(`Goodbye_${p.constructor.name}_2`) >= 0) {
                                done();
                            }
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));
                });
            });
        }
    });
});

describe('Function $speech.t()', () => {
    describe('without platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('WELCOME'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('Welcome_Default')).toBe(true);
                        done();
                    });
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('UNDEFINED'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('UNDEFINED')).toBe(true);
                        done();
                    });
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('GOODBYE'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell(['Goodbye_Default_1', 'Goodbye_Default_2'])).toBe(true);
                        done();
                    });
                });
            });
        }
    });

    describe('with platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('WELCOME'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell(`Welcome_${p.constructor.name}`)).toBe(true);
                        done();
                    });
                });

                test('for empty string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('EMPTY'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('')).toBe(true);
                        done();
                    });
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('DEFAULT'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('Default')).toBe(true);
                        done();
                    });
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.t('GOODBYE'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell([`Goodbye_${p.constructor.name}_1`, `Goodbye_${p.constructor.name}_2`])).toBe(true);
                        done();
                    });
                });
            });
        }
    });
});

describe('Function $speech.addT()', () => {
    describe('without platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('WELCOME'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('Welcome_Default')).toBe(true);
                        done();
                    });
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('UNDEFINED'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('UNDEFINED')).toBe(true);
                        done();
                    });
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': {
                                    translation: i18nData.translation
                                }
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('GOODBYE'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell(['Goodbye_Default_1', 'Goodbye_Default_2'])).toBe(true);
                        done();
                    });
                });
            });
        }
    });

    describe('with platform specific responses', () => {
        for (const p of [new Alexa(), new GoogleAssistant()]) {
            describe(`for ${p.constructor.name}`, () => {
                test('for string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('WELCOME'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell(`Welcome_${p.constructor.name}`)).toBe(true);
                        done();
                    });
                });

                test('for empty string', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('EMPTY'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('')).toBe(true);
                        done();
                    });
                });

                test('for undefined key', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('DEFAULT'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell('Default')).toBe(true);
                        done();
                    });
                });

                test('for string array', async (done) => {
                    const app = new App({
                        i18n: {
                            resources: {
                                'en-US': i18nData
                            }
                        }
                    });
                    app.use(p);
                    app.setHandler({
                        LAUNCH() {
                            this.tell(this.$speech.addT('GOODBYE'));
                        }
                    });

                    const t = p.makeTestSuite();
                    const launchRequest: JovoRequest = await t.requestBuilder.launch();
                    app.handle(ExpressJS.dummyRequest(launchRequest));

                    app.on('response', (handleRequest: HandleRequest) => {
                        expect(handleRequest.jovo!.$response!.isTell([`Goodbye_${p.constructor.name}_1`, `Goodbye_${p.constructor.name}_2`])).toBe(true);
                        done();
                    });
                });
            });
        }
    });
});
