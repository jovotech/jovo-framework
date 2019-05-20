
import { App } from 'jovo-framework';
import { ValidationError, IsRequiredValidator, ValidValuesValidator, InvalidValuesValidator, Jovo } from 'jovo-core';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    LAUNCH() {
        console.log(this.t('WELCOME_GLOBAL'));

        this.toStateIntent('STATE', 'ExampleIntent');
    },

    async MyNameIsIntent() {
        const schema = {
            name: [
                new IsRequiredValidator(),
                new ValidValuesValidator(['Mercedes', 'Bmw', RegExp('dsa.', 'g'), /hll./g]),
                async function (this: Jovo) {
                    if (this.$inputs.name.value === 'baby')
                        throw new ValidationError('Function failed.', 'OwnFunction');
                }
            ],
            day: new ValidValuesValidator(['', ''])
        }

        for (let i = 0; i < 100; i++) {
            console.time('time');
            const validation = await this.validate(schema);
            if (validation.failed('name', 'ValidValuesValidator')) { }
            console.timeEnd('time');
        }

        this.tell(`Hey ${this.$inputs.name.value}`);
    },

    Unhandled() {
        this.tell('Unhandled');
    }
});


export { app };
