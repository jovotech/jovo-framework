import { IsRequiredValidator, ValidValuesValidator } from 'jovo-plugin-validation';

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
            // name: [
            //     new IsRequiredValidator(),
            //     // new ValidValuesValidator(['John', 'Sean'], 'Unhandled')
            // ]
            name: [
                new IsRequiredValidator('STATE.SecondUnhandled'),
                new ValidValuesValidator(['James', 'Henry'], 'STATE.SecondUnhandled'),
                function(this: any) {
                    if(this.$inputs.name.value === 'Ruben') {
                        this.toIntent('Unhandled');
                    }
                }
            ]
        }
    }
};

export = config;
