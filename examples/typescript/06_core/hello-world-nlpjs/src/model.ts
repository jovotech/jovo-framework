
const {JovoModelNlpjs} = require('jovo-model-nlpjs');

const jovoModelInstance = new JovoModelNlpjs();
const jovoModelData = require('./../../models/en-US');
console.log(jovoModelData);
const locale = 'en-US';
jovoModelInstance.importJovoModel(jovoModelData, locale);
const nlpjsModelFiles = jovoModelInstance.exportNative();
console.log(JSON.stringify(nlpjsModelFiles, null, '\t'));
