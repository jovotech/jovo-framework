import { GoogleSheetsCMS } from '../src/';
import { HandleRequest, BaseApp } from 'jovo-core';


describe('GoogleSheetsCMS.constructor()', () => {
    test('without config', () => {
        const i18n = new GoogleSheetsCMS();
        expect(i18n.config.credentialsFile).toEqual('./credentials');
    });

    test('with config', () => {
        const i18n = new GoogleSheetsCMS({ credentialsFile: '../test' });
        expect(i18n.config.credentialsFile).toEqual('../test');
    });
});

// describe('GoogleSheetsCMS.install()', () => {
//     test('with config.filesDir', async () => {
//         const i18Next = new I18Next({
//             filesDir: './test/i18n/'
//         });

//         const mockHR: HandleRequest = {
//             app: new BaseApp(),
//             host: {
//                 hasWriteFileAccess: true,
//                 headers: {},
//                 $request: {},
//                 getRequestObject() {

//                 },
//                 setResponse() {
//                     return new Promise((res, rej) => {

//                     });
//                 },
//                 fail() {

//                 }
//             }
//         };

//         mockHR.app.getAppTypes = () => {
//             return ['AlexaSkill'];
//         };

//         await i18Next.loadFiles(mockHR);

//         // @ts-ignore
//         expect(mockHR.app.config.platformSpecificResponses).toBe(true);
//         expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual('Welcome_Default');
//         expect(mockHR.app.$cms.I18Next.resources['en-US'].AlexaSkill.translation.WELCOME).toEqual('Welcome_Alexa');
//         expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
//     });

//     test('with config.resources', async () => {
//         const i18Next = new I18Next({
//             resources: {
//                 'en-US': i18nData
//             }
//         });

//         const mockHR: HandleRequest = {
//             app: new BaseApp(),
//             host: {
//                 hasWriteFileAccess: true,
//                 headers: {},
//                 $request: {},
//                 getRequestObject() {

//                 },
//                 setResponse() {
//                     return new Promise((res, rej) => {

//                     });
//                 },
//                 fail() {

//                 }
//             }
//         };

//         mockHR.app.getAppTypes = () => {
//             return ['AlexaSkill'];
//         };

//         await i18Next.loadFiles(mockHR);

//         // @ts-ignore
//         expect(mockHR.app.config.platformSpecificResponses).toBe(true);
//         expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual('Welcome_Default');
//         expect(mockHR.app.$cms.I18Next.resources['en-US'].AlexaSkill.translation.WELCOME).toEqual('Welcome_Alexa');
//         expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
//     });

//     test('with config.resources without platform-specifics', async () => {
//         const i18Next = new I18Next({
//             resources: {
//                 'en-US': {
//                     translation: i18nData.translation
//                 }
//             }
//         });

//         const mockHR: HandleRequest = {
//             app: new BaseApp(),
//             host: {
//                 hasWriteFileAccess: true,
//                 headers: {},
//                 $request: {},
//                 getRequestObject() {

//                 },
//                 setResponse() {
//                     return new Promise((res, rej) => {

//                     });
//                 },
//                 fail() {

//                 }
//             }
//         };

//         mockHR.app.getAppTypes = () => {
//             return ['AlexaSkill'];
//         };

//         await i18Next.loadFiles(mockHR);

//         // @ts-ignore
//         expect(mockHR.app.config.platformSpecificResponses).toBeUndefined();
//         expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual('Welcome_Default');
//         expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
//     });
// });