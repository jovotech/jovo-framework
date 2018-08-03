'use strict';

const _ = require('lodash');
/**
 * Alexa card base class
 */
class Card {
    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Sets type of card
     * @param {string} type
     * @return {Error}
     */
    setType(type) {
        if (!type) {
            return new Error('type cannot be empty');
        }
        this.type = type;
    }
}

/**
 * Alexa simple card class
 */
class SimpleCard extends Card {
    /**
     * Constructor
     * @param {SimpleCard=} simpleCard
     */
    constructor(simpleCard) {
        super();
        this.type = 'Simple';

        if (simpleCard) {
            if (simpleCard.title) {
                this.title = simpleCard.title;
            }
            if (simpleCard.content) {
                this.content = simpleCard.content;
            }
        }
    }

    /**
     * Sets title of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} title
     * @return {*}
     */
    setTitle(title) {
        if (!title) {
            return new Error('title cannot be empty');
        }
        this.title = title;
        return this;
    }

    /**
     * Sets content of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} content
     * @return {*}
     */
    setContent(content) {
        if (!content) {
            return new Error('content cannot be empty');
        }
        this.content = content;
        return this;
    }
}

/**
 * Standard Alexa card with title, body text and image
 */
class StandardCard extends Card {
    /**
     * Constructor
     * @param {StandardCard=} standardCard
     */
    constructor(standardCard) {
        super();
        this.type = 'Standard';
        if (standardCard) {
            if (standardCard.title) {
                this.title = standardCard.title;
            }
            if (standardCard.text) {
                this.text = standardCard.text;
            }
            if (standardCard.image.smallImageUrl) {
                this.image.smallImageUrl = standardCard.image.smallImageUrl;
            }
            if (standardCard.image.largeImageUrl) {
                this.image.largeImageUrl = standardCard.image.largeImageUrl;
            }
        }
    }
    /**
     * Sets title of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} title
     * @return {*}
     */
    setTitle(title) {
        if (!title) {
            return new Error('title cannot be empty');
        }
        this.title = title;
        return this;
    }
    /**
     * Sets text of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} text
     * @return {*}
     */
    setText(text) {
        if (!text) {
            return new Error('text cannot be empty');
        }
        this.text = text;
        return this;
    }

    /**
     * Sets image of standard card
     * @param {*} image
     * @return {*}
     */
    setImage(image) {
        if (!image) {
            return new Error('image cannot be empty');
        }
        this.image = image;
        return this;
    }

    /**
     * Sets small image url
     * @param {string} smallImageUrl
     * @return {*}
     */
    setSmallImageUrl(smallImageUrl) {
        if (!smallImageUrl) {
            return new Error('smallImageUrl cannot be empty');
        }
        if (smallImageUrl.substr(0, 5) !== 'https') {
            throw new Error('Url must be https');
        }
        _.set(this, 'image.smallImageUrl', smallImageUrl);
        return this;
    }
    /**
     * Sets large image url
     * @param {string} largeImageUrl
     * @return {Error}
     */
    setLargeImageUrl(largeImageUrl) {
        if (!largeImageUrl) {
            return new Error('largeImageUrl cannot be empty');
        }
        if (largeImageUrl.substr(0, 5) !== 'https') {
            throw new Error('Url must be https');
        }
        _.set(this, 'image.largeImageUrl', largeImageUrl);
        return this;
    }
}

/**
 * Alexa Link Account card
 */
class LinkAccountCard extends Card {
    /**
     * Constructor
     */
    constructor() {
        super();
        this.type = 'LinkAccount';
    }
}

/**
 * AskFormPermissionConsentCard base class
 */
class AskForPermissionConsentCard extends Card {
    /**
     * Constrcutor
     */
    constructor() {
        super();
        this.type = 'AskForPermissionsConsent';
        this.permissions = [];
    }

    /**
     * Adds permission to array
     * @param {*} permission
     * @return {AskForPermissionConsentCard}
     */
    addPermission(permission) {
        this.permissions.push(permission);
        return this;
    }

    /**
     * Sets permission array
     * @param {array} permissions
     * @return {AskForPermissionConsentCard}
     */
    setPermissions(permissions) {
        this.permissions = permissions;
        return this;
    }
}

/**
 * Class AskForListPermissionsCard
 */
class AskForListPermissionsCard extends AskForPermissionConsentCard {

    /**
     * Constructor
     * @param {Array<string>=} types
     */
    constructor(types) {
        super();

        if (types) {
            for (let type of types) {
                if (type !== 'read' && type !== 'write') {
                    throw new Error('Invalid permission type');
                }

                if (type === 'read') {
                    this.addReadPermission();
                }

                if (type === 'write') {
                    this.addWritePermission();
                }
            }
        }
    }

    /**
     * Adds read permission
     * @return {AskForListPermissionsCard}
     */
    addReadPermission() {
        this.addPermission('read::alexa:household:list');
        return this;
    }

    /**
     * Adds write permission
     * @return {AskForListPermissionsCard}
     */
    addWritePermission() {
        this.addPermission('write::alexa:household:list');
        return this;
    }

    /**
     * Adds read and write permission
     * @return {AskForListPermissionsCard}
     */
    addFullPermission() {
        this.addReadPermission();
        this.addWritePermission();
        return this;
    }
}

/**
 * Class AskForLocationPermissionsCard
 */
class AskForLocationPermissionsCard extends AskForPermissionConsentCard {
    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Sets ask for address permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForAddressPermission() {
        this.setPermissions(['read::alexa:device:all:address']);
        return this;
    }

    /**
     * Sets ask for country and postal code permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForCountryAndPostalCodePermission() {
        this.setPermissions(['read::alexa:device:all:address:country_and_postal_code']);
        return this;
    }
}

/**
 * Class AskForListPermissionsCard
 */
class AskForContactPermissionsCard extends AskForPermissionConsentCard {

    /**
     * Constructor
     * @param {Array<string>=} contactProperties
     */
    constructor(contactProperties) {
        super();

        if (contactProperties) {
            this.setAskForContactPermission(contactProperties);
        }
    }

    /**
     * Sets ask for contact permission
     * @param {Array<string>|string} contactProperties
     * @return {AskForContactPermissionsCard}
     */
    setAskForContactPermission(contactProperties) {
        if (typeof contactProperties === 'string') {
            contactProperties = [contactProperties];
        }
        contactProperties.forEach((contactProperty) => {
            this.addPermission(`alexa::profile:${contactProperty}:read`);
        });
        return this;
    }
}

module.exports.SimpleCard = SimpleCard;
module.exports.StandardCard = StandardCard;
module.exports.LinkAccountCard = LinkAccountCard;
module.exports.AskForListPermissionsCard = AskForListPermissionsCard;
module.exports.AskForLocationPermissionsCard = AskForLocationPermissionsCard;
module.exports.AskForContactPermissionsCard = AskForContactPermissionsCard;

