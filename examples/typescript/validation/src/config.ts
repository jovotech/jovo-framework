import { IsRequiredValidator, InvalidValuesValidator, ReplaceValuesValidator } from 'jovo-plugin-validation';

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
        MyNameIsIntent: {
            name: [
                new IsRequiredValidator({
                    onFail: 'STATE.SecondUnhandled'
                }),
                new InvalidValuesValidator({
                    values: ['James', 'Henry'],
                }),
                function (this: any) {
                    if (this.$inputs.name.value === 'Ruben') {
                        this.toIntent('STATE.Unhandled');
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
        name: [new IsRequiredValidator()]
    }
};

export = config;
