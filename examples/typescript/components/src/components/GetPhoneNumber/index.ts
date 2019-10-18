import { Handler } from 'jovo-framework/node_modules/jovo-core';
import { ComponentPlugin } from 'jovo-framework';

import { Config, GetPhoneNumberConfig } from './src/config';
import { phoneNumberHandler } from './src/handler';

export class GetPhoneNumber extends ComponentPlugin {
    handler: Handler = phoneNumberHandler;
    config: GetPhoneNumberConfig = Config;
    pathToI18n = './src/i18n/';

    constructor(config?: GetPhoneNumberConfig) {
        super(config);
    }
}