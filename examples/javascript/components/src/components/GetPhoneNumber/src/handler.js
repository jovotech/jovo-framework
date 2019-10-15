const { PhoneNumberFormat, PhoneNumber } = require('google-libphonenumber');
const phoneNumberUtilInstance = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const phoneNumberHandler = {
    GetPhoneNumber: {
        START() {
            if (this.$components.GetPhoneNumber.data.phoneNumber) {
                return sendComponentResponse(this, 'SUCCESSFUL');
            }
            this.$session.$data.COMPONENT_GetPhoneNumber = {
                failCount: 0,
                phoneNumber: ''
            };
            this.$speech.t('component-GetPhoneNumber.start-question');
            return this.ask(this.$speech);
        },
        PhoneNumberIntent() {
            let phoneNumber = this.$inputs.phoneNumber.value;
            if (typeof phoneNumber === 'number') {
                phoneNumber = phoneNumber.toString();
            }
            this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw = phoneNumber;
            this.$speech.t('component-GetPhoneNumber.confirm-question', { phoneNumber });
            this.$reprompt.t('component-GetPhoneNumber.confirm-reprompt', { phoneNumber });
            return this.ask(this.$speech, this.$reprompt);
        },
        YesIntent() {
            if (!this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw) {
                return this.toIntent('HelpIntent');
            }
            const region = this.$request.getLocale().split('-')[1];
            const phoneNumber = phoneNumberUtilInstance.parse(this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw, region);
            if (!phoneNumberUtilInstance.isValidNumber(phoneNumber)) {
                return invalidNumber(this);
            }
            const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
            this.$components.GetPhoneNumber.data.phoneNumber = formattedPhoneNumber;
            return sendComponentResponse(this, 'SUCCESSFUL');
        },
        NoIntent() {
            this.$session.$data.COMPONENT_GetPhoneNumber.failCount++;
            if (this.$session.$data.COMPONENT_GetPhoneNumber.failCount === this.$components.GetPhoneNumber.config.numberOfFails) {
                return this.toStateIntent('GetPhoneNumber.Sequence', 'START');
            }
            this.$speech.t('component-GetPhoneNumber.confirm-reject');
            this.$reprompt.t(`component-GetPhoneNumber.reprompt`);
            return this.ask(this.$speech, this.$reprompt);
        },
        HelpIntent() {
            this.$speech.t('component-GetPhoneNumber.help');
            this.$reprompt.t('component-GetPhoneNumber.reprompt');
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
        Sequence: {
            START() {
                this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberSequenceCount = 0;
                this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw = '';
                this.$speech.t('component-GetPhoneNumber.sequence-start');
                return this.ask(this.$speech);
            },
            PhoneNumberSequenceIntent() {
                const sequence = this.$inputs.sequence.value;
                this.$session.$data.COMPONENT_GetPhoneNumber.sequence = sequence;
                this.$speech.t('component-GetPhoneNumber.sequence-confirm-question', { sequence });
                return this.ask(this.$speech);
            },
            YesIntent() {
                this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberSequenceCount += 1;
                const phoneNumberSequenceCount = this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberSequenceCount;
                let sequence = this.$session.$data.COMPONENT_GetPhoneNumber.sequence;
                if (typeof sequence === 'number') {
                    sequence = sequence.toString();
                }
                this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw += sequence;
                if (phoneNumberSequenceCount === 1) {
                    this.$speech.t('component-GetPhoneNumber.sequence-question');
                    this.$reprompt.t('component-GetPhoneNumber.sequence-reprompt');
                    return this.ask(this.$speech, this.$reprompt);
                }
                else if (phoneNumberSequenceCount === 2) {
                    this.$speech.t('component-GetPhoneNumber.sequence-last-digits-question');
                    this.$reprompt.t('component-GetPhoneNumber.sequence-last-digits-reprompt');
                    return this.ask(this.$speech, this.$reprompt);
                }
                else {
                    const region = this.$request.getLocale().split('-')[1];
                    let phoneNumber = new PhoneNumber();
                    try {
                        phoneNumber = phoneNumberUtilInstance.parse(this.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw, region);
                    }
                    catch (error) {
                        return invalidNumber(this);
                    }
                    if (!phoneNumberUtilInstance.isValidNumber(phoneNumber)) {
                        return invalidNumber(this);
                    }
                    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
                    this.$components.GetPhoneNumber.data.phoneNumber = formattedPhoneNumber;
                    return sendComponentResponse(this, 'SUCCESSFUL');
                }
            },
            NoIntent() {
                this.$speech.t('component-GetPhoneNumber.sequence-confirm-reject');
                return this.ask(this.$speech);
            },
            HelpIntent() {
                this.$speech.t('component-GetPhoneNumber.sequence-help');
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
};

function invalidNumber(jovo) {
    if (jovo.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberSequenceCount) {
        jovo.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberSequenceCount = 0;
    }
    jovo.$session.$data.COMPONENT_GetPhoneNumber.phoneNumberRaw = '';
    jovo.$speech.t('component-GetPhoneNumber.fail-invalid');
    return jovo.ask(jovo.$speech);
}

function formatPhoneNumber(phoneNumber) {
    const phoneNumberE164 = phoneNumberUtilInstance.format(phoneNumber, PhoneNumberFormat.E164);
    return phoneNumberE164;
}

function sendComponentResponse(jovo, status) {
    const response = {
        status
    };
    if (status === 'SUCCESSFUL') {
        response.data = jovo.$components.GetPhoneNumber.data;
    }
    else if (status === 'ERROR') {
        response.error = jovo.$handleRequest.error;
    }
    return jovo.sendComponentResponse(response);
}

module.exports = phoneNumberHandler;
