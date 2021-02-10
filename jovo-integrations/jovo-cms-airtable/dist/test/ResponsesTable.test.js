"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n = require("i18next");
const jovo_core_1 = require("jovo-core");
const _cloneDeep = require("lodash.clonedeep");
const src_1 = require("../src");
const cI18nModel = require("./mockObj/i18nModel.json");
const mockHR_1 = require("./mockObj/mockHR");
const cTableValues = require("./mockObj/tableValues.json");
process.env.NODE_ENV = 'UNIT_TEST';
let tableValues; // tslint:disable-line
let i18nModel; // tslint:disable-line
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
    tableValues = _cloneDeep(cTableValues);
    i18nModel = _cloneDeep(cI18nModel);
});
describe('ResponsesTable.constructor()', () => {
    test('without config', () => {
        const responsesTable = new src_1.ResponsesTable();
        expect(responsesTable.config.enabled).toBeTruthy();
    });
    test('with config', () => {
        const responsesTable = new src_1.ResponsesTable({ enabled: false });
        expect(responsesTable.config.enabled).toBeFalsy();
    });
});
describe('ResponsesTable.install()', () => {
    test('should register Cms.t()', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const responsesTable = new src_1.ResponsesTable();
        responsesTable.install(airtableCMS);
        expect(new jovo_core_1.Cms().t).toBeInstanceOf(Function);
    });
});
describe('ResponsesTable.parse()', () => {
    test('should throw error if name is not set', () => {
        const responsesTable = new src_1.ResponsesTable();
        expect(() => responsesTable.parse(handleRequest, [])).toThrow('name has to be set');
    });
    test('without headers and without values', () => {
        const responsesTable = new src_1.ResponsesTable({ name: 'test' });
        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        responsesTable.parse(handleRequest, []);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
    test('without headers', () => {
        const responsesTable = new src_1.ResponsesTable({
            name: 'test',
        });
        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        tableValues.shift();
        responsesTable.parse(handleRequest, tableValues);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
    test('without values', () => {
        const responsesTable = new src_1.ResponsesTable({
            name: 'test',
        });
        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        tableValues = [tableValues[0]];
        responsesTable.parse(handleRequest, tableValues);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
    test('with valid values', () => {
        const responsesTable = new src_1.ResponsesTable({
            name: 'test',
        });
        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        responsesTable.parse(handleRequest, tableValues);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
    });
    test('should merge new values in existing i18n object', () => {
        const responsesTable = new src_1.ResponsesTable({
            name: 'test',
        });
        // @ts-ignore
        i18n.init({
            interpolation: {
                escapeValue: false,
            },
            load: 'all',
            resources: {
                'en-US': {
                    translation: {
                        WELCOME: ['Welcome'],
                    },
                },
            },
            returnObjects: true,
        });
        handleRequest.app.$cms.I18Next = { i18n };
        expect(handleRequest.app.$cms.I18Next.i18n.store.data).toStrictEqual({
            'en-US': {
                translation: {
                    WELCOME: ['Welcome'],
                },
            },
        });
        responsesTable.parse(handleRequest, tableValues);
        expect(handleRequest.app.$cms.I18Next.i18n.store.data).toStrictEqual(i18nModel);
    });
    test('with platform-specific responses', () => {
        const app = new jovo_core_1.BaseApp();
        const airtableCMS = new src_1.AirtableCMS({ apiKey: '123', baseId: '234' });
        airtableCMS.install(app);
        const responsesTable = new src_1.ResponsesTable({
            name: 'test',
        });
        responsesTable.install(airtableCMS);
        handleRequest.app.getAppTypes = () => {
            return ['AlexaSkill'];
        };
        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        tableValues[0].push('en-US-AlexaSkill');
        tableValues[1].push('Welcome_Alexa');
        i18nModel['en-US'].AlexaSkill = {
            translation: {
                WELCOME: ['Welcome_Alexa'],
            },
        };
        responsesTable.parse(handleRequest, tableValues);
        // @ts-ignore
        expect(app.config.platformSpecificResponses).toBeTruthy();
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
    });
});
//# sourceMappingURL=ResponsesTable.test.js.map