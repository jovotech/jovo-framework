import { IsRequiredValidator } from 'jovo-plugin-validation';

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
            name: new IsRequiredValidator()
        }
    }
};

export = config;
