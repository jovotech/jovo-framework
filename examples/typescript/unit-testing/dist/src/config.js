"use strict";
const jovo_framework_1 = require("jovo-framework");
module.exports = jovo_framework_1.config({
    logging: false,
    user: {
        metaData: true
    },
    intentMap: {
        'AMAZON.StopIntent': 'END'
    },
    db: {
        FileDb: {
            pathToFile: './../../db/db.json'
        }
    }
});
//# sourceMappingURL=config.js.map