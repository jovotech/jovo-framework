import { GoogleSheetsCMS } from '../src/';
import { HandleRequest, BaseApp } from 'jovo-core';

describe('GoogleSheetsCMS.constructor()', () => {
    test('without config', () => {
        const googleSheets = new GoogleSheetsCMS();
        expect(googleSheets.config.credentialsFile).toMatch('./credentials.json');
        expect(googleSheets.actionSet.get('retrieve')!.parent).toStrictEqual(googleSheets);
    });

    test('with config', () => {
        const googleSheets = new GoogleSheetsCMS({ credentialsFile: '../test' });
        expect(googleSheets.config.credentialsFile).toMatch('../test');
    });
});