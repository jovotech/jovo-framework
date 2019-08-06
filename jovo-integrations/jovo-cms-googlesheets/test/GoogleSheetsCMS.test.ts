import { BaseApp } from 'jovo-core';

import { GoogleSheetsCMS } from '../src/';

process.env.NODE_ENV = 'UNIT_TEST';

describe('GoogleSheetsCMS.constructor()', () => {
    test('without config', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        expect(googleSheetsCMS.config.credentialsFile).toMatch('./credentials.json');
    });

    test('with config', () => {
        const googleSheetsCMS = new GoogleSheetsCMS({ credentialsFile: '../test' });
        expect(googleSheetsCMS.config.credentialsFile).toMatch('../test');
    });

    test('should register "this" in ActionSet on "retrieve"', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        expect(googleSheetsCMS.actionSet.get('retrieve')!.parent)
            .toStrictEqual(googleSheetsCMS);
    });
});

describe('GoogleSheetsCMS.install()', () => {
    test('should assign parameter "app" to "this.baseApp"', async () => {
        const app = new BaseApp();
        const googleSheetsCMS = new GoogleSheetsCMS();
        await googleSheetsCMS.install(app);
        expect(googleSheetsCMS.baseApp).toStrictEqual(app);
    });

    test('should register middleware on setup', async () => {
        const app = new BaseApp();
        const googleSheetsCMS = new GoogleSheetsCMS();

        let fn;
        fn = app.middleware('setup')!.fns.find((i) => i.name === 'bound retrieveSpreadsheetData');
        expect(fn).toBeUndefined();

        await googleSheetsCMS.install(app);

        fn = app.middleware('setup')!.fns.find((i) => i.name === 'bound retrieveSpreadsheetData');
        expect(fn).toBeDefined();
    });

    test('should install default sheet', async () => {
        const app = new BaseApp();
        const googleSheetsCMS = new GoogleSheetsCMS({
            sheets: [
                {
                    name: 'test'
                }
            ]
        });

        let fn;
        fn = googleSheetsCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();

        await googleSheetsCMS.install(app);

        fn = googleSheetsCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
});
