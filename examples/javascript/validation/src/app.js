'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { ValidationError, InvalidValuesValidator, IsRequiredValidator } = require('jovo-core');
const https = require('https');

const { OwnValidator } = require('./Validators/OwnValidator');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    LAUNCH() {
        this.ask('Hello, what is your name?', 'What is your name?');
    },

    async MyNameIsIntent() {
        const schema = {
            name: [
                new IsRequiredValidator(),
                new OwnValidator(),
                new InvalidValuesValidator(['Reginald', 'Thomas', 'Alexander']),
                async function () {
                    try {
                        const todoData = await new Promise((res, rej) => {
                            https.get('https://jsonplaceholder.typicode.com/todos/1', function (r) {
                                let data = '';
                                r.on('data', function (d) {
                                    data += d;
                                });

                                r.on('error', (e) => {
                                    rej(e);
                                })

                                r.on('end', function () {
                                    res(JSON.parse(data));
                                });
                            });
                        });

                        if (todoData.id === 1) {
                            throw new ValidationError('AsyncFunctionValidator', 'Id cannot be 1.');
                        }
                    } catch (e) {
                        if (e.constructor === ValidationError) {
                            throw e;
                        } else {
                            throw new ValidationError('AsyncFunctionValidator', e)
                        }
                    }
                }
            ]
        };

        const validation = await this.validateAsync(schema);

        if (validation.failed('name', 'AsyncFunctionValidator', 'Id cannot be 1.')) {
            return this.ask(
                'There was a problem while fetching the ToDo data. Please tell me your name again.',
                'Please tell me your name again.'
            );
        }

        if (validation.failed('name')) {
            return this.ask(
                'We encountered a problem with your name. Please tell me your name again.',
                'Please tell me your name again.'
            );
        }

        this.tell(`Hey ${this.$inputs.name.value}`);
    },

    WorkDayIntent() {
        const schema = {
            workday: new InvalidValuesValidator([
                /S.*day/g
            ])
        };

        const validation = this.validate(schema);

        if (validation.failed('InvalidValuesValidator')) {
            return this.ask(
                `${this.$inputs.workday.value} is not a valid workday. Please tell me the day again.`,
                'Please tell me the day again.'
            );
        }

        this.tell(`Your current workday is ${this.$inputs.workday.value}.`);
    },

    Unhandled() {
        this.tell('Unhandled');
    }
});

module.exports = { app };
