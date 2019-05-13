import { IsRequiredValidator, InvalidValuesValidator, ReplaceValuesValidator, ValidValuesValidator } from 'jovo-plugin-validation';

const config = {
    logging: false,

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    db: {
        FileDb: {
            pathToFile: './../../db/db.json'
        }
    },
    validation: {
        'STATE.MyNameIsIntent': {
            name: new ValidValuesValidator({
                values: ['Bob', 'Henry'],
                onFail: 'STATE.MyNameIsIntentFailed'
            })
        },
        MyNameIsIntent: {
            name: [
                new InvalidValuesValidator({
                    values: ['James', 'Henry'],
                }),
                function (this: any) {
                    console.log('Function validator called.');
                    if (this.$inputs.name.value === 'Ruben') {
                        this.toIntent('MyNameIsIntentFailed');
                    }
                },
                new ReplaceValuesValidator(
                    {
                        values: ['Shawn', 'John'],
                        mapTo: 'Sean'
                    },
                    {
                        values: ['Mike', 'Mark'],
                        mapTo: 'Michael'
                    }
                )
            ]
        },
        DayIntent: {
            day: new ValidValuesValidator({
                values: ['Monday', 'Tuesday'],
                onFail: 'DayIntentFailed'
            })
        },
        name: new IsRequiredValidator(),
        day: [
            new IsRequiredValidator()
        ]
    }
};

export = config;
