import { ComponentConfig } from 'jovo-framework';

interface GetPhoneNumberConfig extends ComponentConfig {
    numberOfFails: number;
}

const config: GetPhoneNumberConfig = {
    intentMap: {
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.NoIntent': 'NoIntent',
        'AMAZON.StopIntent': 'END',
        'StopIntent': 'END',
        'AMAZON.YesIntent': 'YesIntent'
    },
    numberOfFails: 3
};

export {GetPhoneNumberConfig, config as Config};