import { GoogleSheetsCMS } from '../src/';
import { BaseApp } from 'jovo-core';

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

        const fnsOld = app.middleware('setup')!.fns.map((i) => {
            return i.name === 'bound retrieveSpreadsheetData' ? i : null;
        });
        expect(fnsOld.length).toEqual(0);

        await googleSheetsCMS.install(app);
        
        const fnsNew = app.middleware('setup')!.fns.map((i) => {
            return i.name === 'bound retrieveSpreadsheetData' ? i : null;
        });
        expect(fnsNew.length).toEqual(1);
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

        const fnsOld = googleSheetsCMS.middleware('retrieve')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsOld.length).toEqual(0);

        await googleSheetsCMS.install(app);
        
        const fnsNew = googleSheetsCMS.middleware('retrieve')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsNew.length).toEqual(1);
    });
});