const {PhoneNumberFormat, PhoneNumber} = require('google-libphonenumber');
const PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

module.exports = {
    PHONE_NUMBER: {
        START() {
            this.$session.$data.COMPONENT_PHONE_NUMBER = {
                failCount: 0,
                phoneNumber: ''
            };
            this.$speech.t('component-phone-number.start-question');
    
            return this.ask(this.$speech);
        },
    
        PhoneNumberIntent() {
            let phoneNumber = this.$inputs.phoneNumber.value;
    
            if (typeof phoneNumber === 'number') {
                phoneNumber = phoneNumber.toString();
            }
    
            this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw = phoneNumber;
    
            this.$speech.t('component-phone-number.confirm-question', {phoneNumber: phoneNumber});
            this.$reprompt.t('component-phone-number.confirm-reprompt', {phoneNumber: phoneNumber});
    
            return this.ask(this.$speech, this.$reprompt);
        },
    
        YesIntent() {
            if (!this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw) {
                return this.toIntent('HelpIntent');
            }
    
            // validate phone number
            const region = this.$request.getLocale().split('-')[1]; // e.g. "en-US" -> "US"
            const phoneNumber = PhoneNumberUtil.parse(this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw, region);
    
            if (!PhoneNumberUtil.isValidNumber(phoneNumber)) {
                return invalidNumber(this);
            }
    
            const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    
            const data = {
                phoneNumber: formattedPhoneNumber
            };
    
            return sendComponentResponse(this, 'SUCCESSFUL', data);
        },
    
        NoIntent() {
            this.$session.$data.COMPONENT_PHONE_NUMBER.failCount++;
    
            if (this.$session.$data.COMPONENT_PHONE_NUMBER.failCount === this.$components.PHONE_NUMBER.config.numberOfFails) {
                return this.toStateIntent('SEQUENCE', 'START');
            }
    
            this.$speech.t('component-phone-number.confirm-reject');
            this.$reprompt.t(`component-phone-number.reprompt`);
    
            return this.ask(this.$speech, this.$reprompt);
        },
    
        HelpIntent() {
            this.$speech.t('component-phone-number.help');
            this.$reprompt.t('component-phone-number.reprompt');
    
            return this.ask(this.$speech, this.$reprompt);
        },
    
        END() {
            return sendComponentResponse(this, 'REJECTED');
        },
    
        ON_ERROR() {
            return sendComponentResponse(this, 'ERROR');
        },
    
        Unhandled() {
            return this.toIntent('HelpIntent');
        },
    
        SEQUENCE: {
            /**
             * Conversation to get the number by asking for 3 sequences containing 3 digits, instead of trying to get the whole number at once
             */
            START() {
                this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount = 0;
                this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw = '';
    
                this.$speech.t('component-phone-number.sequence-start');
    
                return this.ask(this.$speech);
            },
    
            PhoneNumberSequenceIntent() {
                const sequence = this.$inputs.sequence.value;
                this.$session.$data.COMPONENT_PHONE_NUMBER.sequence = sequence;
    
                this.$speech.t('component-phone-number.sequence-confirm-question', {sequence: sequence});
    
                return this.ask(this.$speech);
            },
    
            YesIntent() {
                const phoneNumberSequenceCount = this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount;
                const sequence = this.$session.$data.COMPONENT_PHONE_NUMBER.sequence;
    
                if (typeof sequence === 'number') {
                    sequence = sequence.toString();
                }
    
                this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw += sequence;
    
                if (phoneNumberSequenceCount < 2) {
                    this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount = phoneNumberSequenceCount + 1;
    
                    this.$speech.t('component-phone-number.sequence-question');
                    this.$reprompt.t('component-phone-number.sequence-reprompt');
    
                    return this.ask(this.$speech, this.$reprompt);
                }
                else {
                    // validate phone number
                    const region = this.$request.getLocale().split('-')[1]; // e.g. "en-US" -> "US"
                    const phoneNumber = PhoneNumberUtil.parse(this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw, region);
                
                    if (!PhoneNumberUtil.isValidNumber(phoneNumber)) {
                        return invalidNumber(this);
                    }
    
                    const formattedPhoneNumber = formatPhoneNumber(this);
    
                    const data = {
                        phoneNumber: formattedPhoneNumber
                    };
            
                    return sendComponentResponse(this, 'SUCCESSFUL', data);
                }
            },
        
            NoIntent() {
                this.$speech.t('component-phone-number.sequence-confirm-reject');
        
                return this.ask(this.$speech);
            },
        
            HelpIntent() {
                this.$speech.t('component-phone-number.sequence-help');
        
                return this.ask(this.$speech);
            },
        
            END() {
                return sendComponentResponse(this, 'REJECTED');
            },
        
            ON_ERROR() {
                return sendComponentResponse(this, 'ERROR');
            },
        
            Unhandled() {
                return this.toIntent('HelpIntent');
            },
        }
    }
}

/**
 *  
 * @param {Jovo} jovo
 * @returns Jovo response
 */
function invalidNumber(jovo) {
    if (jovo.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount) {
        jovo.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount = 0
    }

    jovo.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberRaw = '';

    jovo.$speech.t('component-phone-number.fail-invalid');

    return jovo.ask(jovo.$speech);
}

/**
 * Formats the phoneNumber to E164 standard
 * @param {PhoneNumber} phoneNumber 
 * @param {string} region User's region, e.g. "US"
 * @returns {string}
 */
function formatPhoneNumber(phoneNumber) {
    const phoneNumberE164 = PhoneNumberUtil.format(phoneNumber, PhoneNumberFormat.E164);

    return phoneNumberE164;
}

/**
 * Prepares `$response` object and routes to the `onCompletedIntent`
 * @param {Jovo} jovo
 * @param {string} status Either "SUCCESSFUL" | "ERROR" | "REJECTED"
 * @param {{}} data data object that should be parsed in the response
 */
function sendComponentResponse(jovo, status, data) {
    const response = {
        status,
        data
    };

    jovo.$components.PHONE_NUMBER.$response = response;

    return jovo.toStateIntent(jovo.$components.PHONE_NUMBER.stateBeforeDelegate, jovo.$components.PHONE_NUMBER.onCompletedIntent);
}