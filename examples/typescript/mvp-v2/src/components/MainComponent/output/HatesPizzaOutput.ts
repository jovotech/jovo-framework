import { Jovo, BaseOutput } from '@jovotech/framework';

export class HatesPizzaOutput extends BaseOutput {

    /*
    |--------------------------------------------------------------------------
    | Output Template
    |--------------------------------------------------------------------------
    |
    | This structured output is later turned into a native response
    | Learn more here: www.jovo.tech/docs/output
    |
    */
    build() {
        return { 
            message: 'That\'s OK! Not everyone likes pizza.',
        }
    };

    constructor(jovo: Jovo) {
        super(jovo);
    }
}
