'use strict';

const DialogFlowRequest = require('../../googleaction/request/dialogFlowRequest').DialogFlowRequest;

/**
 * Dialogflow NLU
 */
class DialogFlowNLU extends DialogFlowRequest {
    /**
     * Constructor
     * @param {*} options object
     */
    constructor(options) {
        super();
        this.options = options;
    }

    /**
     * WORK IN PROGRESS.
     * @param {String} text
     * @param {callback} callback
     */
    execute(text, callback) {
        try {
            let apiai = require('apiai');
            const dialogflow = apiai(this.options.clientAccessToken);
            let dfReq = dialogflow.textRequest(text, {
                sessionId: this.options.sessionId,
            });

            dfReq.on('response', (response) => {
                Object.assign(this, response);
                callback();
            });
            dfReq.on('error', (error) => {
                callback(error);
            });
            dfReq.end();
        } catch (err) {
            throw err;
        }
    }
}

module.exports.DialogFlowNLU = DialogFlowNLU;
