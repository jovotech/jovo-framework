'use strict';

const _ = require('lodash');

const PERMISSIONS_ENUM = Object.freeze({
    NAME: 'NAME',
    DEVICE_COARSE_LOCATION: 'DEVICE_COARSE_LOCATION',
    DEVICE_PRECISE_LOCATION: 'DEVICE_PRECISE_LOCATION',
});

/**
 * AlexaResponse Class
 */
class GoogleActionResponse {
    /**
     * Constructor
     * @param {*=} responseObj
     */
    constructor(responseObj) {
        this.responseObj = {
            speech: '<speak></speak>',
            data: {
                google: {
                    expectUserResponse: true,
                    richResponse: {
                        items: [],
                    },
                },
            },
        };

        if (responseObj) {
            this.responseObj = responseObj;
        }
    }

    /**
     * Returns a contextOut object by the given name
     * @param {string} name
     * @return {*}
     */
    getContextOut(name) {
        if (!this.responseObj.contextOut) {
            return {};
        }
        for (let i = 0; i < this.responseObj.contextOut.length; i++) {
            if (this.responseObj.contextOut[i].name.toLowerCase() === name.toLowerCase()) {
                return this.responseObj.contextOut[i];
            }
        }
        return {};
    }

    /**
     * Sets context out object. Overwrites existing objects with same name
     * @param {*} contextObj
     */
    setContextOut(contextObj) {
        if (!this.responseObj.contextOut || this.responseObj.contextOut.length === 0) {
            this.addContextOutObject(contextObj);
        } else {
            for (let i = 0; i < this.responseObj.contextOut.length; i++) {
                if (this.responseObj.contextOut[i].name.toLowerCase() ===
                    contextObj.name.toLowerCase()) {
                    this.responseObj.contextOut[i] = contextObj;
                }
            }
        }
    }


    /**
     * Sets context out object with an array of contexts
     * @param {array} contexts
     */
    setContextOutArray(contexts) {
        this.responseObj.contextOut = contexts;
    }

    /**
     * Adds context to contextOut array
     * @param {object} context
     */
    addContextOutObject(context) {
        if (!this.responseObj.contextOut) {
            this.responseObj.contextOut = [];
        }
        this.responseObj.contextOut.push(context);
    }

    /**
     * Sets parameters to context
     * @param {string} contextName
     * @param {{}} parameters
     * @return {GoogleActionResponse}
     */
    setContextOutParameters(contextName, parameters) {
        let context = this.getContextOut(contextName);
        context.parameters = parameters;
        return this;
    }

    /**
     * Sets parameters to context
     * @param {string} contextName
     * @param {{}} parameters
     * @param {number=} lifespan
     * @return {GoogleActionResponse}
     */
    setContextOutParametersCreateOrUpdate(contextName, parameters, lifespan) {
        let context = this.getContextOut(contextName);
        if (!context || Object.keys(context).length === 0) {
            context = {
                name: contextName,
                lifespan: lifespan || 10000,
                parameters: parameters,
            };
            this.addContextOutObject(context);
        } else {
            context.parameters = parameters;
            this.setContextOut(context);
        }

        return this;
    }

    /**
     * Adds parameter to a given context object
     * @param {string} contextName
     * @param {string} parameterName
     * @param {*} value
     * @return {GoogleActionResponse}
     */
    addContextOutParameter(contextName, parameterName, value) {
        let context = this.getContextOut(contextName);
        _.set(context, `parameters.${parameterName}`, value);
        return this;
    }

    /**
     * Returns all session attributes.
     * @return {{}}
     */
    getSessionAttributes() {
        return this.getContextOut('session').parameters;
    }

    /**
     * Returns parameter for given context
     * @param {string} contextName
     * @param {string} parameterName
     * @return {*}
     */
    getContextOutParameter(contextName, parameterName) {
        let context = this.getContextOut(contextName);
        if (!context) {
            throw new Error(`No context with name ${contextName} found.`);
        }
        return context.parameters[parameterName];
    }

    /**
     * Returns permissions to ask to the user
     * @return {*}
     */
    getPermissions() {
        return _.get(this, 'responseObj.data.google.permissions_request.permissions', []);
    }

    /**
     * Sets name permission to response
     * @deprecated
     * @return {GoogleActionResponse}
     */
    setNamePermission() {
        return setPermissionToResponse.call(this, PERMISSIONS_ENUM.NAME);
    }

    /**
     * Sets device coarse location permission to response
     * @deprecated
     * @return {GoogleActionResponse}
     */
    setDeviceCoarseLocationPermission() {
        return setPermissionToResponse.call(this, PERMISSIONS_ENUM.DEVICE_COARSE_LOCATION);
    }

    /**
     * Sets device precise location permission to response
     * @deprecated
     * @return {GoogleActionResponse}
     */
    setDevicePreciseLocationPermission() {
        return setPermissionToResponse.call(this, PERMISSIONS_ENUM.DEVICE_PRECISE_LOCATION);
    }

    /**
     *
     * Speaks and closes session
     * JOVO function
     * @param {string} speech
     * @return {GoogleActionResponse}
     */
    tell(speech) {
        this.responseObj.speech = speech;
        this.responseObj.data.google.expectUserResponse = false;
        let editedSimpleResponse = false;
        for (let item of this.responseObj.data.google.richResponse.items) {
            if (item.simpleResponse) {
                item.simpleResponse.ssml = speech;
                editedSimpleResponse = true;
            }
        }

        if (!editedSimpleResponse) {
            this.responseObj.data.google.richResponse
                .items.unshift(
                {
                    simpleResponse: {
                        ssml: speech,
                    },
                }
            );
        }
        return this;
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * JOVO function
     * @param {string} speech
     * @param {string} repromptSpeech
     * @return {GoogleActionResponse}
     */
    ask(speech, repromptSpeech) {
        this.tell(speech);
        this.responseObj.speech = speech;
        this.responseObj.data.google.expectUserResponse = true;
        this.responseObj.data.google.noInputPrompts = [];
        for (let noInputPrompt of repromptSpeech) {
            this.responseObj.data.google.noInputPrompts.push({
                ssml: noInputPrompt,
            });
        }
        return this;
    }

    /**
     * Creates an audio tag within ssml
     *
     * JOVO function
     * @param {string} audioUrl
     * @param {string} fallbackText
     * @return {GoogleActionResponse}
     */
    play(audioUrl, fallbackText) {
        let speech = `<speak><audio src="${audioUrl}">${fallbackText}</audio></speak>`;
        return this.tell(speech);
    }

    /**
     * Returns speech text
     * @return {string}
     */
    getSpeechText() {
        if (this.responseObj.data.google.richResponse.items[0]
            .simpleResponse.ssml) {
            return removeSpeakTags(this.responseObj.data
                .google.richResponse.items[0]
                .simpleResponse.ssml);
        }
        return '';
    }


    /**
     * Implementation of generic withSimpleCard
     * Show a simple card to the response object
     * @param {string} title
     * @param {string} formattedText
     * @return {GoogleActionResponse} this
     */
    addBasicCard(title, formattedText) {
        this.responseObj.data.google.richResponse.items.push(
            {
                basicCard: new BasicCard()
                    .setTitle(title)
                    .setFormattedText(formattedText),
            });
        return this;
    }

    /**
     * Implementation of generic withImageCard
     * Show a standard card with a card to the response object
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl secure image url
     * @param {string} accessibilityText
     * @return {GoogleActionResponse} this
     */
    addImageCard(title, formattedText, imageUrl, accessibilityText) {
        this.responseObj.data.google.richResponse.items.push(
            new CardBuilder()
                .createImageCard(
                    title,
                    formattedText,
                    imageUrl,
                    accessibilityText)
                .build());
        return this;
    }


    /**
     * Implementation of generic withAccountLinkingCard
     * Show an account linking card to the response object
     * @return {GoogleActionResponse} this
     */
    addAccountLinkingCard() {
        const previousInputs = this.responseObj.data.google.expectedInputs || [];
        previousInputs.push(getSignInInput());

        this.responseObj.data.google.expectedInputs = previousInputs;
        return this;
    }

    /**
     * Adds item to rich response items
     * @param {*} item
     * @return {GoogleActionResponse}
     */
    addRichResponseItem(item) {
        this.responseObj.data.google.richResponse.items.push(
            item
        );
        return this;
    }

    /**
     * Adds suggestion chips to response
     * Works only with ask responses.
     * @param {Array<String>} chips
     * @return {GoogleActionResponse}
     */
    addSuggestionChips(chips) {
        _.set(this.responseObj, 'data.google.richResponse.suggestions', []);
        for (let chip of chips) {
            this.responseObj.data.google.richResponse.suggestions.push({
                title: chip,
            });
        }
        return this;
    }

    /**
     * Adds link out suggestion
     * @param {string} destinationName
     * @param {string} url
     * @return {GoogleActionResponse}
     */
    addLinkOutSuggestion(destinationName, url) {
        let linkOutSuggestion = {
            destinationName: destinationName,
            url: url,
        };
        _.set(this.responseObj, 'data.google.richResponse.linkOutSuggestion', linkOutSuggestion);
        return this;
    }

    /**
     * Adds list to response
     * @param {Array<OptionItem>} list
     * @return {GoogleActionResponse}
     */
    addList(list) {
        let systemIntent = {
            intent: 'actions.intent.OPTION',
            data: {
                'listSelect': list,
                '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
            },
        };

        _.set(this.responseObj, 'data.google.systemIntent', systemIntent);
        return this;
    }

    /**
     * Adds display text to response
     * @param {string} displayText
     * @TODO: FIXME change only displaytext, not ssml
     * @return {GoogleActionResponse}
     */
    addDisplayText(displayText) {
        this.responseObj.data.google.richResponse
            .items.unshift(
            {
                simpleResponse: {
                    ssml: `<speak>${displayText}</speak>`,
                    displayText: displayText,
                },
            }
        );
        return this;
    }

    /**
     * Adds carousel to response
     * @param {Array<OptionItem>} carousel
     * @return {GoogleActionResponse}
     */
    addCarousel(carousel) {
        let systemIntent = {
            intent: 'actions.intent.OPTION',
            data: {
                'carouselSelect': carousel,
                '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
            },
        };

        _.set(this.responseObj, 'data.google.systemIntent', systemIntent);
        return this;
    }

    /**
     * Adds carousel to response
     * @param {*} carouselBrowse
     * @return {GoogleActionResponse}
     */
    addCarouselBrowse(carouselBrowse) {
        this.responseObj.data.google.richResponse
            .items.push({
                carouselBrowse: carouselBrowse,

            }
        );

        return this;
    }

    /**
     * Creates ask for permission response
     * @param {Array<PERMISSIONS_ENUM>} permissions
     * @param {string} speech
     * @return {GoogleActionResponse}
     */
    addAskForPermission(permissions, speech) {
        this.tell('<speak>' + speech + '</speak>');
        this.responseObj.speech = speech;
        _.set(this.responseObj, 'data.google.expectUserResponse', true);
        let systemIntent = {
            intent: 'assistant.intent.action.PERMISSION',
            data: {
                '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                'optContext': speech,
                'permissions': permissions,
            },
        };

        _.set(this.responseObj, 'data.google.systemIntent', systemIntent);
        return this;
    }

    /**
     * Asks for name permission
     * @param {string} speech
     * @return {GoogleActionResponse}
     */
    addAskForNamePermission(speech) {
        return this.addAskForPermission([PERMISSIONS_ENUM.NAME], speech);
    }

    /**
     * Asks for coarse permission
     * @param {string} speech
     * @return {GoogleActionResponse}
     */
    addAskForCoarseLocation(speech) {
        return this.addAskForPermission([PERMISSIONS_ENUM.DEVICE_COARSE_LOCATION], speech);
    }

    /**
     * Ask for precise permission
     * @param {string} speech
     * @return {GoogleActionResponse}
     */
    addAskForPreciseLocation(speech) {
        return this.addAskForPermission([PERMISSIONS_ENUM.DEVICE_PRECISE_LOCATION], speech);
    }

    /**
     * Adds ask for sign in intent
     * @param {string?} context
     * @return {GoogleActionResponse}
     */
    addAskForSignIn(context) {
        this.responseObj = {
            'speech': 'login',
            'data': {
                'google': {
                    'expectUserResponse': true,
                    'systemIntent': {
                        'intent': 'actions.intent.SIGN_IN',
                        'inputValueData': {
                            '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                            'optContext': context || '',
                        },
                    },
                    'inputPrompt': {
                        'initialPrompts': [
                            {
                                'textToSpeech': 'PLACEHOLDER_FOR_SIGN_IN',
                            },
                        ],
                        'noInputPrompts': [],
                    },
                },
            },
            'contextOut': this.responseObj.contextOut,
        };
        return this;
    }

    /**
     * Adds media response object to response
     * @param {string} contentUri
     * @param {string} name
     * @param {*} options
     * @return {GoogleActionResponse}
     */
    addMediaResponse(contentUri, name, options) {
        let mediaObject = {
            name: name,
            contentUrl: contentUri,
        };
        if (_.get(options, 'description')) {
            mediaObject.description = options.description;
        }

        if (_.get(options, 'largeImage')) {
            mediaObject.largeImage = options.largeImage;
        }

        if (_.get(options, 'icon')) {
            mediaObject.icon = options.icon;
        }


        this.responseObj.data.google.richResponse
            .items.push(
            {
                mediaResponse: {
                    mediaType: 'AUDIO',
                    mediaObjects: [mediaObject],
                },
            }
        );
        return this;
    }

    /**
     * Returns response object
     * @return {object}
     */
    getResponseObject() {
        return this.responseObj;
    }

    /**
     * Checks if response is a tell request
     * @param {string} speechText
     * @return {boolean}
     */
    isTell(speechText) {
        try {
            if (this.responseObj.data.google.expectUserResponse !== false) {
                return false;
            }

            if (speechText) {
                if (speechText.constructor === Array) {
                    let filteredSpeechText = speechText.filter((text) => {
                        return this.responseObj.speech === toSSML(text) &&
                            this.responseObj.data.google.richResponse
                                .items[0].simpleResponse.ssml === toSSML(text);
                    });
                    if (filteredSpeechText.length === 0) {
                        return false;
                    }
                } else {
                    if (this.responseObj.speech !== toSSML(speechText)) {
                        return false;
                    }
                    if (this.responseObj.data.google.richResponse
                        .items[0].simpleResponse.ssml !== toSSML(speechText)) {
                        return false;
                    }
                }
            }
        } catch (err) {
            return false;
        }
        return true;
    }


    /**
     * Checks if response is an ask response.
     * @param {string} speechText
     * @param {string} repromptText
     * @return {boolean}
     */
    isAsk(speechText, repromptText) {
        try {
            if (this.responseObj.data.google.expectUserResponse !== true) {
                return false;
            }

            if (speechText) {
                if (speechText.constructor === Array) {
                    let filteredSpeechText = speechText.filter((text) => {
                        return this.responseObj.speech === toSSML(text) &&
                            this.responseObj.data.google.richResponse
                                .items[0].simpleResponse.ssml === toSSML(text);
                    });
                    if (filteredSpeechText.length === 0) {
                        return false;
                    }
                } else {
                    if (this.responseObj.speech !== toSSML(speechText)) {
                        return false;
                    }
                    if (this.responseObj.data.google.richResponse
                            .items[0].simpleResponse.ssml !==
                        toSSML(speechText)) {
                        return false;
                    }
                }
            }
            if (repromptText) {
                if (repromptText.constructor === Array) {
                    let filteredSpeechText = speechText.filter((text) => {
                        return this.responseObj.data.google.noInputPrompts[0].ssml === toSSML(text);
                    });
                    if (filteredSpeechText.length === 0) {
                        return false;
                    }
                } else {
                    if (this.responseObj.data.google.noInputPrompts[0]
                        .ssml !== toSSML(repromptText)) {
                        return false;
                    }
                }
            }
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * Checks if response is a play response.
     * @param {string} audioUrl
     * @param {string} fallbackText
     * @return {boolean}
     */
    isPlay(audioUrl, fallbackText) {
        let speech = `<speak><audio src="${audioUrl}">${fallbackText}</audio></speak>`;
        return this.isTell(speech);
    }

    /**
     * Checks if response is an empty response.
     * @return {boolean}
     */
    isEmptyResponse() {
        return this.isTell('<break time="1ms"/>');
    }

    /**
     * Checks if response object contains a basic card.
     * @param {string} title
     * @param {string} formattedText
     * @return {boolean}
     */
    hasBasicCard(title, formattedText) {
        try {
            let items = this.responseObj.data.google.richResponse.items;

            let basicCards = items.filter(function(item) {
                return item.basicCard;
            });

            if (basicCards.length === 0) {
                return false;
            }
            if (title) {
                if (basicCards[0].basicCard.title !== title) {
                    return false;
                }
            }

            if (formattedText) {
                if (basicCards[0].basicCard.formattedText !== formattedText) {
                    return false;
                }
            }
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     * Checks if response object contains a basic card with image.
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl
     * @param {string} accessibilityText
     * @return {boolean}
     */
    hasImageCard(title, formattedText, imageUrl, accessibilityText) {
        if (!this.hasBasicCard(title, formattedText)) {
            return false;
        }
        try {
            let items = this.responseObj.data.google.richResponse.items;

            let basicCards = items.filter(function(item) {
                return item.basicCard;
            });

            if (basicCards.length === 0) {
                return false;
            }

            if (imageUrl) {
                if (basicCards[0].basicCard.image.url !== imageUrl) {
                    return false;
                }
            }
            if (accessibilityText) {
                if (basicCards[0].basicCard.image.accessibilityText !==
                    accessibilityText) {
                    return false;
                }
            }
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * Checks if given context is in the response object.
     * @param {string} contextName
     * @param {string} parameterName
     * @param {string} value
     * @return {boolean}
     */
    hasContextOutParameter(contextName, parameterName, value) {
        let context = this.getContextOut(contextName);
        if (!context || Object.keys(context).length === 0) {
            return false;
        }
        if (parameterName) {
            let parameterValue = context.parameters[parameterName];
            if (parameterValue !== value) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if response has state
     * @param {string} state
     * @return {boolean}
     */
    hasState(state) {
        return this.hasContextOutParameter('session', 'STATE', state);
    }

    /**
     * Checks if given session is in the response object.
     * @param {string} name
     * @param {string} value
     * @return {boolean}
     */
    hasSessionAttribute(name, value) {
        return this.hasContextOutParameter('session', name, value);
    }

    /**
     * Checks if given session is defined.
     * @return {boolean}
     */
    hasSessionAttributes() {
        return this.hasContextOutParameter('session');
    }

    /**
     * Checks if given string contains in speech text.
     * @param {string|array} str
     * @return {boolean}
     */
    speechTextContains(str) {
        let speechText = this.getSpeechText();
        if (str instanceof Array) {
            str.forEach(function(s) {
                return speechText.indexOf(str) > -1;
            });
        }

        return speechText.indexOf(str) > -1;
    }
}

/**
 * Cardbuilder class
 * @deprecated
 */
class CardBuilder {
    /**
     * Constructor
     * @constructor
     * @public
     */
    constructor() {
        this.card = {};
    }

    /**
     * Creates basic card
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @return {CardBuilder}
     */
    createBasicCard(title, formattedText) {
        let basicCard = new BasicCard()
            .setTitle(title)
            .setFormattedText(formattedText);

        this.card = {
            basicCard: basicCard,
        };
        return this;
    }

    /**
     * Creates image card
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl
     * @param {string} accessibilityText
     * @return {CardBuilder}
     */
    createImageCard(title, formattedText, imageUrl, accessibilityText) {
        let basicCard = new BasicCard()
            .setTitle(title)
            .setFormattedText(formattedText);
        if (imageUrl) {
            basicCard.setImage(imageUrl, accessibilityText);
        }
        this.card.basicCard = basicCard;

        return this;
    }

    /**
     * Returns card object
     * @public
     * @return {object}
     */
    build() {
        return this.card;
    }

}


/**
 * Removes speak tags
 * @param {string} text
 * @return {XML|string}
 */
function removeSpeakTags(text) {
    return text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
}

/**
 * Surrounds text with <speak> tags
 * @param {string} text
 * @return {string|*}
 */
function toSSML(text) {
    text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
    text = '<speak>' + text + '</speak>';
    return text;
}

/**
 * Sets device permission to response
 * @param {string} permission
 * @return {GoogleActionResponse}
 */
function setPermissionToResponse(permission) {
    let permissionArray = this.getPermissions();

    permissionArray.push(permission);
    permissionArray = _.uniq(permissionArray);

    _.set(this, 'responseObj.data.google.permissions_request.permissions', permissionArray);
    return this;
}

/**
 * Gets signIn input object
 * @return {object} signInInput
 */
function getSignInInput() {
    return {
        inputPrompt: {
            initialPrompts: [
                {
                    textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
                },
            ],
            noInputPrompts: [],
        },
        possibleIntents: [
            {
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {},
            },
        ],
    };
}

/**
 * Base class for a carousel or a list.
 */
class Collection {
    /**
     * Constructor
     * @param {*=} items
     */
    constructor(items) {
        this.items = [];

        if (items) {
            this.items = items;
        }
    }

    /**
     * Adds item to collection
     * @param {OptionItem} item
     */
    addItem(item) {
        this.items.push(item);
    }
}

/**
 * Carousel UI element for devices with SCREEN_OUTPUT
 * Items can be selected via voice or via touch
 */
class Carousel extends Collection {
    /**
     * Constructor
     * @param {Array<OptionItem>=} items
     */
    constructor(items) {
        super(items);
    }
}

/**
 * Browsing Carousel UI element for devices with SCREEN_OUTPUT
 */
class CarouselBrowse extends Collection {
    /**
     * Constructor
     * @param {Array<OptionItem>=} items
     */
    constructor(items) {
        super(items);
    }
}


/**
 * List UI element for devices with SCREEN_OUTPUT
 * Items can be selected via voice or via touch
 */
class List extends Collection {
    /**
     * Constructor
     * @param {Array<OptionItem>=} items
     */
    constructor(items) {
        super(items);
    }

    /**
     * Sets title of the list
     * @param {string} title
     * @return {List}
     */
    setTitle(title) {
        if (!title) {
            throw new Error('title cannot be empty');
        }
        this.title = title;
        return this;
    }
}

/**
 * CarouselItem Class
 */
class CarouselItem {
    /**
     * constructor
     * @param {OptionItem=} item
     */
    constructor(item) {
        if (item) {
            if (item.title) {
                this.title = item.title;
            }
            if (item.description) {
                this.description = item.description;
            }
            if (item.image) {
                this.image = item.image;
            }
        }
    }

    /**
     * Sets title of item
     * @param {string} title
     * @return {List}
     */
    setTitle(title) {
        if (!title) {
            throw new Error('title cannot be empty');
        }
        this.title = title;
        return this;
    }

    /**
     * Sets description of item
     * @param {string} description
     * @return {List}
     */
    setDescription(description) {
        if (!description) {
            throw new Error('description cannot be empty');
        }
        this.description = description;
        return this;
    }

    /**
     * Sets image of element
     * @param {string} url
     * @param {string} accessibilityText
     * @param {int=} width
     * @param {int=} height
     * @return {OptionItem}
     */
    setImage(url, accessibilityText, width, height) {
        if (!url) {
            throw new Error('url cannot be empty');
        }

        if (!accessibilityText) {
            throw new Error('accessibilityText cannot be empty');
        }

        this.image = {
            url: url,
            accessibilityText: accessibilityText,
        };

        if (width) {
            this.image.width = width;
        }
        if (height) {
            this.image.height = height;
        }

        return this;
    }
}

/**
 * OptionItem for collections
 */
class OptionItem extends CarouselItem {
    /**
     * constructor
     * @param {OptionItem=} item
     */
    constructor(item) {
        super(item);
        this.optionInfo = {
            key: '',
            synonyms: [],
        };

        if (item) {
            if (item.optionInfo) {
                this.optionInfo = item.optionInfo;
            }
        }
    }

    /**
     * Sets key of item
     * @param {string} key
     * @return {OptionItem}
     */
    setKey(key) {
        if (!key) {
            throw new Error('key cannot be empty');
        }
        this.optionInfo.key = key;
        return this;
    }

    /**
     * Adds synonym
     * @param {string} synonym
     * @return {OptionItem}
     */
    addSynonym(synonym) {
        if (!synonym) {
            throw new Error('synonym cannot be empty');
        }
        this.optionInfo.synonyms.push(synonym);
        return this;
    }


}

/**
 * CarouselBrowserTile class. CarouselBrowser item
 */
class CarouselBrowseTile extends CarouselItem {
    /**
     * Constructor
     * @param {CarouselBrowseTile} item
     */
    constructor(item) {
        super(item);

        this.openUrlAction = {
            urlTypeHint: 'URL_TYPE_HINT_UNSPECIFIED',
        };

        if (item) {
            if (item.title) {
                this.footer = item.footer;
            }

            if (item.openUrlAction) {
                if (item.openUrlAction.url) {
                    this.openUrlAction.url = item.openUrlAction.url;
                }

                if (item.openUrlAction.urlTypeHint) {
                    this.openUrlAction.urlTypeHint = item.openUrlAction.urlTypeHint;
                }
            }
        }
    }

    /**
     * Sets footer of the list
     * @param {string} footer
     * @return {CarouselBrowseTile}
     */
    setFooter(footer) {
        if (!footer) {
            throw new Error('footer cannot be empty');
        }
        this.footer = footer;
        return this;
    }

    /**
     * Sets openUrlAction of the list
     * @param {string} openUrlAction
     * @return {CarouselBrowseTile}
     */
    setOpenUrlAction(openUrlAction) {
        if (!openUrlAction) {
            throw new Error('footer cannot be empty');
        }
        this.openUrlAction = openUrlAction;
        return this;
    }

    /**
     * Sets url type hint
     * @param {string} urlTypeHint
     */
    setUrlTypeHint(urlTypeHint) {
        if (Object.keys(
            CarouselBrowseTile
                .urlTypeHints()).filter((name) => name === urlTypeHint).length === 0) {
            throw new Error('Valid type hints are: ' + Object.keys(this.urlTypeHints()).toString());
        }
        this.openUrlAction.urlTypeHint = urlTypeHint;
    }

    /**
     * url types
     * @return {{URL_TYPE_HINT_UNSPECIFIED: string, AMP_CONTENT: string}}
     */
    static urlTypeHints() {
        return {
            URL_TYPE_HINT_UNSPECIFIED: 'URL_TYPE_HINT_UNSPECIFIED',
            AMP_CONTENT: 'AMP_CONTENT',
        };
    }
}

/**
 * Basic card UI element
 */
class BasicCard {
    /**
     * Constructor
     * @param {BasicCard=} basicCard
     */
    constructor(basicCard) {
        if (basicCard) {
            if (basicCard.title) {
                this.title = basicCard.title;
            }
            if (basicCard.subtitle) {
                this.subtitle = basicCard.subtitle;
            }
            if (basicCard.formattedText) {
                this.formattedText = basicCard.formattedText;
            }
            if (basicCard.image) {
                this.image = basicCard.image;
            }
            if (basicCard.imageDisplayOptions) {
                this.imageDisplayOptions = basicCard.imageDisplayOptions;
            }
            if (basicCard.buttons) {
                this.buttons = basicCard.buttons;
            }
        }
    }

    /**
     * Sets title of item
     * @param {string} title
     * @return {BasicCard}
     */
    setTitle(title) {
        if (!title) {
            throw new Error('Title cannot be empty');
        }
        this.title = title;
        return this;
    }

    /**
     * Sets subtitle of item
     * @param {string} subtitle
     * @return {BasicCard}
     */
    setSubtitle(subtitle) {
        if (!subtitle) {
            throw new Error('Subtitle cannot be empty');
        }
        this.subtitle = subtitle;
        return this;
    }

    /**
     * Sets body text of item
     * @param {string} formattedText
     * @return {BasicCard}
     */
    setFormattedText(formattedText) {
        if (!formattedText) {
            throw new Error('FormattedText cannot be empty');
        }
        this.formattedText = formattedText;
        return this;
    }

    /**
     * Sets image of element
     * @param {string} url
     * @param {string} accessibilityText
     * @param {int=} width
     * @param {int=} height
     * @return {OptionItem}
     */
    setImage(url, accessibilityText, width, height) {
        if (!url) {
            throw new Error('url cannot be empty');
        }

        if (!accessibilityText) {
            throw new Error('accessibilityText cannot be empty');
        }

        this.image = {
            url: url,
            accessibilityText: accessibilityText,
        };

        if (width) {
            this.image.width = width;
        }
        if (height) {
            this.image.height = height;
        }

        return this;
    }

    /**
     * Adds button to basic card
     * @param {string} text
     * @param {string} url
     * @return {BasicCard}
     */
    addButton(text, url) {
        if (!this.buttons) {
            this.buttons = [];
        }
        if (!text) {
            throw new Error('text cannot be empty');
        }
        if (!url) {
            throw new Error('url cannot be empty');
        }
        this.buttons.push({
            title: text,
            openUrlAction: {
                url: url,
            },
        });
        return this;
    }

    /**
     * Sets the image display option
     * @param {string} imageDisplayOptions display option
     * @return {BasicCard}
     */
    setImageDisplay(imageDisplayOptions) {
        if (!imageDisplayOptions) {
            throw new Error('Image Display Option cannot be empty');
        }
        if (['DEFAULT', 'WHITE', 'CROPPED'].indexOf(imageDisplayOptions) === -1) {
            throw new Error('Image Display Option must be one of DEFAULT, WHITE, CROPPED');
        }
        this.imageDisplayOptions = imageDisplayOptions;
        return this;
    }


}

module.exports.GoogleActionResponse = GoogleActionResponse;
module.exports.BasicCard = BasicCard;
module.exports.OptionItem = OptionItem;

module.exports.CarouselItem = CarouselItem;
module.exports.Carousel = Carousel;
module.exports.CarouselBrowse = CarouselBrowse;
module.exports.CarouselBrowseTile = CarouselBrowseTile;
module.exports.List = List;
module.exports.GoogleActionResponse.CardBuilder = CardBuilder;
