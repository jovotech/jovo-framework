// import { ResponsesTable, AirtableCMS } from '../src';
// import { HandleRequest, Cms, BaseApp } from 'jovo-core';
// import * as cPublicSheetValues from './mockObj/publicSheetValues.json';
// import * as cPrivateSheetValues from './mockObj/privateSheetValues.json';
// import * as cI18nModel from './mockObj/i18nModel.json';
// import { MockHandleRequest } from './mockObj/mockHR';
// import _cloneDeep = require('lodash.clonedeep');
// import * as i18n from 'i18next';

// let publicSheetValues: any[];       // tslint:disable-line
// let privateSheetValues: any[];      // tslint:disable-line
// let i18nModel: any;                 // tslint:disable-line
// let handleRequest: HandleRequest;
// beforeEach(() => {
//     handleRequest = new MockHandleRequest();
//     publicSheetValues = _cloneDeep(cPublicSheetValues);
//     privateSheetValues = _cloneDeep(cPrivateSheetValues);
//     i18nModel = _cloneDeep(cI18nModel);
// });

// describe('ResponsesTable.constructor()', () => {
//     test('without config', () => {
//         const responsesTable = new ResponsesTable();
//         expect(responsesTable.config.enabled).toBeTruthy();
//     });

//     test('with config', () => {
//         const responsesTable = new ResponsesTable({ enabled: false });
//         expect(responsesTable.config.enabled).toBeFalsy();
//     });
// });

// describe('ResponsesTable.install()', () => {
//     test('should register Cms.t()', () => {
//         const airtableCMS = new AirtableCMS();
//         const responsesTable = new ResponsesTable();

//         expect(new Cms().t).toBeUndefined();
//         responsesTable.install(airtableCMS);
//         expect(new Cms().t).toBeInstanceOf(Function);
//     });
// });

// describe('ResponsesTable.parse()', () => {
//     test('should throw error if name is not set', () => {
//         const responsesTable = new ResponsesTable();
//         expect(() => responsesTable.parse(handleRequest, []))
//             .toThrow('name has to be set');
//     });

//     test('without headers and without values', () => {
//         const responsesTable = new ResponsesTable({ name: 'test' });

//         expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//         expect(handleRequest.app.$cms.test).toBeUndefined();

//         responsesTable.parse(handleRequest, []);

//         expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//         expect(handleRequest.app.$cms.test).toStrictEqual({});
//     });

//     test('without headers', () => {
//         const responsesTable = new ResponsesTable({
//             name: 'test'
//         });

//         expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//         expect(handleRequest.app.$cms.test).toBeUndefined();

//         publicSheetValues.shift();
//         responsesTable.parse(handleRequest, publicSheetValues);

//         expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//         expect(handleRequest.app.$cms.test).toStrictEqual({});
//     });

//     test('without values', () => {
//         const responsesTable = new ResponsesTable({
//             name: 'test'
//         });

//         expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//         expect(handleRequest.app.$cms.test).toBeUndefined();

//         publicSheetValues = [publicSheetValues[0]];
//         responsesTable.parse(handleRequest, publicSheetValues);

//         expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//         expect(handleRequest.app.$cms.test).toStrictEqual({});
//     });

//     test('with valid public spreadsheet values', () => {
//         const responsesTable = new ResponsesTable({
//             name: 'test'
//         });

//         expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//         expect(handleRequest.app.$cms.test).toBeUndefined();

//         responsesTable.parse(handleRequest, publicSheetValues);

//         expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//         expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
//     });

//     test('with valid private spreadsheet values', () => {
//         const responsesTable = new ResponsesTable({
//             name: 'test'
//         });

//         expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//         expect(handleRequest.app.$cms.test).toBeUndefined();

//         responsesTable.parse(handleRequest, privateSheetValues);

//         expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//         expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
//     });

//     test('should merge new values in existing i18n object', () => {
//         const responsesTable = new ResponsesTable({
//             name: 'test'
//         });

//         i18n.init({
//             resources: {
//                 'en-US': {
//                     translation: {
//                         WELCOME: ['Welcome']
//                     }
//                 }
//             },
//             load: 'all',
//             returnObjects: true,
//             interpolation: {
//                 escapeValue: false, // do not escape ssml tags
//             }
//         });

//         handleRequest.app.$cms.I18Next = { i18n };

//         expect(handleRequest.app.$cms.I18Next.i18n.store.data)
//             .toStrictEqual({
//                 'en-US': {
//                     translation: {
//                         WELCOME: ['Welcome']
//                     }
//                 }
//             });

//         responsesTable.parse(handleRequest, publicSheetValues);

//         expect(handleRequest.app.$cms.I18Next.i18n.store.data).toStrictEqual(i18nModel);
//     });

//     describe('with platform-specific responses', () => {
//         test('with private spreadsheet values', () => {
//             const app = new BaseApp();
//             const googleSheetsCMS = new GoogleSheetsCMS();
//             googleSheetsCMS.install(app);
//             const responsesTable = new ResponsesTable({
//                 name: 'test'
//             });
//             responsesTable.install(googleSheetsCMS);
//             handleRequest.app.getAppTypes = () => {
//                 return ['AlexaSkill'];
//             };

//             expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//             expect(handleRequest.app.$cms.test).toBeUndefined();

//             privateSheetValues[0].push('en-US-AlexaSkill');
//             privateSheetValues[1].push('Welcome_Alexa');
//             i18nModel['en-US'].AlexaSkill = {
//                 translation: {
//                     WELCOME: ['Welcome_Alexa']
//                 }
//             };
//             responsesTable.parse(handleRequest, privateSheetValues);

//             // @ts-ignore
//             expect(app.config.platformSpecificResponses).toBeTruthy();
//             expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//             expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
//         });

//         test('with public spreadsheet values', () => {
//             const app = new BaseApp();
//             const googleSheetsCMS = new GoogleSheetsCMS();
//             googleSheetsCMS.install(app);
//             const responsesTable = new ResponsesTable({
//                 name: 'test'
//             });
//             responsesTable.install(googleSheetsCMS);
//             handleRequest.app.getAppTypes = () => {
//                 return ['AlexaSkill'];
//             };

//             expect(handleRequest.app.$cms.I18Next).toBeUndefined();
//             expect(handleRequest.app.$cms.test).toBeUndefined();

//             publicSheetValues[0].push('en-us-alexaskill');
//             publicSheetValues[1].push('Welcome_Alexa');
//             i18nModel['en-US'].AlexaSkill = {
//                 translation: {
//                     WELCOME: ['Welcome_Alexa']
//                 }
//             };
//             responsesTable.parse(handleRequest, publicSheetValues);

//             // @ts-ignore
//             expect(app.config.platformSpecificResponses).toBeTruthy();
//             expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
//             expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
//         });
//     });
// });