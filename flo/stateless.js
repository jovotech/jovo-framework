
const moment = require('moment');

const _ = require('lodash');

const config = require('./../config/config');
const STATE = require('./../config/states');
const tracking = require('./../tracking');

const nickname = require('./../util/nickname');

module.exports = {
    log: async function(jovo) {
        // console.log('stateless.log()');
        const state = jovo.getSessionAttribute('STATE');
        let viewport = undefined;
        if (jovo.isAlexaSkill()) {
            jovo.user().data.AplSupport = Object.keys(
                jovo.request().context.System.device.supportedInterfaces
            ).indexOf('Alexa.Presentation.APL') > -1;
            viewport = jovo.request().context.Viewport || undefined;
        } else {
            jovo.user().data.AplSupport = false;
        }
        if (viewport) {
            // console.log(`Viewport: ${JSON.stringify(jovo.request().context.Viewport, null, 4)}`);
            viewport = `${
                viewport.pixelWidth
            }x${
                viewport.pixelHeight
            }`;
            console.log(`Viewport string: ${viewport}`);
        }
        jovo.user().data.viewport = viewport;
        jovo.user().data.startState = state;
        jovo.user().data.requestDetails = [];
        jovo.user().data.requestDetail = '';
        try {
            const intentName = jovo.getIntentName();
            jovo.user().data.requestName = intentName;
            try {
                const slots = jovo.getInputs();
                // console.log(`Slots: ${JSON.stringify(slots, null, 4)}`);
                const slotKeys = Object.keys(slots);
                if (slotKeys.length === 1) {
                    jovo.user().data.requestDetail = `${
                        slots[slotKeys[0]].value
                    }${
                        slots[slotKeys[0]].id ? ' (' + slots[slotKeys[0]].id + ')' : ''
                    }`;
                    jovo.user().data.requestDetails.push(
                        {
                            name: slots[slotKeys[0]].name,
                            value: slots[slotKeys[0]].value,
                            id: slots[slotKeys[0]].id,
                        }
                    );
                    console.log(
                        `${jovo.user().data.nickname} | `
                        + `${state} | `
                        + `${intentName} | `
                        + `${slots[slotKeys[0]].name} `
                        + `-> ${slots[slotKeys[0]].value} `
                        + `(ID ${slots[slotKeys[0]].id})`
                    );
                } else if (slotKeys.length > 1) {
                    // console.log(`Multiple slots!`);
                    console.log(
                        `${jovo.user().data.nickname} | `
                        + `${state} | `
                        + `${intentName}`
                    );
                    for (let i = 0; i < slotKeys.length; i++) {
                        if (slots[slotKeys[i]].value) {
                            jovo.user().data.requestDetails.push(
                                {
                                    name: slots[slotKeys[0]].name,
                                    value: slots[slotKeys[0]].value,
                                    id: slots[slotKeys[0]].id,
                                }
                            );
                            console.log(
                                `${i + 1}: ${slots[slotKeys[i]].name} `
                                + `-> ${slots[slotKeys[i]].value} `
                                + `(ID ${slots[slotKeys[i]].id}) | `
                            );
                        }
                    }
                } else {
                    console.log(
                        `${jovo.user().data.nickname} | `
                        + `${state} | `
                        + `${intentName}`
                    );
                }
            } catch (error) {
                console.log(
                    `${jovo.user().data.nickname} | `
                    + `${state} | `
                    + `${intentName}`
                );
            }
        } catch (error) {
            const requestType = jovo.getPlatform().request.getType();
            jovo.user().data.requestName = requestType;
            if (requestType === 'LAUNCH') {
                console.log(
                    `${jovo.user().data.nickname} | `
                    + `${requestType}`
                );
            } else if (requestType === 'SessionEndedRequest') {
                const reason = jovo.getPlatform().request.getReason();
                const error = jovo.getPlatform().request.getError() || undefined;
                const errorString = JSON.stringify(error);
                jovo.user().data.requestDetails.push(
                    {
                        reason: reason,
                        error: errorString,
                    }
                );
                tracking.googleAnalytics.sessionEndedException(
                    jovo,
                    `${
                        reason
                    }:${
                        _.get(error, 'type') || ''
                    }:${
                        _.get(error, 'message') || ''
                    }`
                );
                console.log(
                    `${jovo.user().data.nickname} | `
                    + `${requestType} | `
                    + `${reason} | `
                    + `${errorString}`
                );
                // console.time('Tracking request:');
                // await tracking.endSessionEvent(
                //     jovo,
                //     {
                //         reason: reason,
                //         error: error,
                //     }
                // );
                // console.timeEnd('Tracking request:');
            } else {
                console.log(`Request: ${JSON.stringify(jovo.getPlatform().request.request, null, 4)}`);
            }
        }
    }
}