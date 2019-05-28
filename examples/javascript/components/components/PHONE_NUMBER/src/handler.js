const PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat;
const PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

module.exports = {
    START() {
        this.$session.$data.COMPONENT_PHONE_NUMBER = {
            failCount: 0,
            phoneNumber: ''
        };
        this.$speech.t('component-phone-number-start-question');
        return this.ask(this.$speech);
    },

    COMPONENT_PHONE_NUMBER_PhoneNumberIntent() {
        let phoneNumber = this.$inputs.phoneNumber.value;

        if (typeof phoneNumber === 'number') {
            phoneNumber = phoneNumber.toString();
        }

        this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumber = phoneNumber;

        this.$speech.t('component-phone-number-confirm-question', {phoneNumber: phoneNumber});
        this.$reprompt.t('component-phone-number-confirm-reprompt', {phoneNumber: phoneNumber});

        this.ask(this.$speech, this.$reprompt);
    },

    COMPONENT_PHONE_NUMBER_YesIntent() {
        if (!this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumber) {
            return this.toIntent('COMPONENT_PHONE_NUMBER_HelpIntent');
        }

        const response = {
            status: 'SUCCESSFUL',
            data: {
                phoneNumber: this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumber
            }
        };
        this.$components.PHONE_NUMBER.$response = response;

        return this.toIntent(this.$components.PHONE_NUMBER.onCompletedIntent);
    },

    COMPONENT_PHONE_NUMBER_NoIntent() {
        this.$session.$data.COMPONENT_PHONE_NUMBER.failCount++;

        if (this.$session.$data.COMPONENT_PHONE_NUMBER.failCount === 3) {
            return this.toStateIntent('COMPONENT_PHONE_NUMBER_SEQUENCE', 'COMPONENT_PHONE_NUMBER_Start');
        }

        this.$speech.t('component-phone-number-confirm-reject');
        this.$reprompt.t(`component-phone-number-reprompt`);

		return this.ask(this.$speech, this.$reprompt);
    },

    COMPONENT_PHONE_NUMBER_HelpIntent() {
        this.$speech.t('component-phone-number-help');
        this.$reprompt.t('component-phone-number-reprompt');

        return this.ask(this.$speech, this.$reprompt);
    },

    END() {
        const response = {
            status: "REJECTED"
        };

        this.$components.PHONE_NUMBER.$response = response;

        this.toIntent(this.$components.PHONE_NUMBER.onCompletedIntent);
    },

    ON_ERROR() {
        const response = {
            status: "ERROR"
        };

        this.$components.PHONE_NUMBER.$response = response;

        this.toIntent(this.$components.PHONE_NUMBER.onCompletedIntent);
    },

    Unhandled() {
        return this.toIntent('COMPONENT_PHONE_NUMBER_HelpIntent');
    },

    COMPONENT_PHONE_NUMBER_SEQUENCE: {
        COMPONENT_PHONE_NUMBER_Start() {
            this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount = 0;

            this.$speech.t('component-phone-number-sequence-start');

            this.ask(this.$speech);
        },

        COMPONENT_PHONE_NUMBER_PhoneNumberSequenceIntent() {
            const sequence = this.$inputs.sequence.value;
            this.$session.$data.COMPONENT_PHONE_NUMBER.sequence = sequence;

            this.$speech.t('component-phone-number-sequence-confirm-question', {sequence: sequence});

            this.ask(this.$speech);
        },

        COMPONENT_PHONE_NUMBER_YesIntent() {
            const phoneNumberSequenceCount = this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount;
            const sequence = this.$session.$data.COMPONENT_PHONE_NUMBER.sequence;

            if (typeof sequence === 'number') {
                sequence = sequence.toString();
            }

            this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumber += sequence;

            if (phoneNumberSequenceCount < 2) {
                this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumberSequenceCount = phoneNumberSequenceCount + 1;

                this.$speech.t(component-phone-number-sequence-question);
                this.$reprompt.t(component-phone-number-sequence-reprompt);

                return this.ask(this.$speech, this.$reprompt);
            }
            else {
                const formattedPhoneNumber = formatPhoneNumber(this);

                this.$components.PHONE_NUMBER.$response = {
                    status: 'SUCCESSFUL',
                    data: {
                        phoneNumber: formattedPhoneNumber
                    }
                };

                return this.toIntent(this.$components.PHONE_NUMBER.onCompletedIntent);
            }
        },
    
        COMPONENT_PHONE_NUMBER_NoIntent() {
            this.$speech.t('component-phone-number-sequence-confirm-reject');
    
            return this.ask(this.$speech);
        },
    
        COMPONENT_PHONE_NUMBER_HelpIntent() {
            this.$speech.t('component-phone-number-sequence-help');
    
            return this.ask(this.$speech);
        },
    
        END() {
            const response = {
                status: "REJECTED"
            };
    
            this.$components.PHONE_NUMBER.$response = response;
    
            this.toIntent(this.$components.PHONE_NUMBER.onCompletedIntent);
        },
    
        ON_ERROR() {
            const response = {
                status: "ERROR"
            };
    
            this.$components.PHONE_NUMBER.$response = response;
    
            this.toIntent(this.$components.PHONE_NUMBER.onCompletedIntent);
        },
    
        Unhandled() {
            return this.toIntent('COMPONENT_PHONE_NUMBER_HelpIntent');
        },
    }
}


// Helper
function formatPhoneNumber(jovo) {
    let phoneNumber = this.$session.$data.COMPONENT_PHONE_NUMBER.phoneNumber;
    const countryCode = jovo.getLocale().split('-')[1]; // "en-US" -> ["en", "US"] -> "US";
    phoneNumber = PhoneNumberUtil.parse(phoneNumber, countryCode);
    const phoneNumberFormatted = PhoneNumberUtil.format(phoneNumber, PhoneNumberFormat.E164);

    return phoneNumberFormatted;
}
