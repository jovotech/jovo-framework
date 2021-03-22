import { Jovo, BaseOutput } from '@jovotech/framework';

export class LovesPizzaOutput extends BaseOutput {

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
            message: 'Yes! I love pizza, too.',
        }
    };

    constructor(jovo: Jovo) {
        super(jovo);
    }
}
