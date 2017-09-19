'use strict';
/**
 * Cardbuilder class
 * @deprecated
 */
class AlexaCardBuilder {

    /**
     * Constructor
     */
    constructor() {
        this.card = {};
    }

    /**
     * Creates simple card
     * @param {string} title
     * @param {string} content
     * @return {CardBuilder}
     */
    createSimpleCard(title, content) {
        this.card = {
            type: 'Simple',
            title: title,
            content: content,
        };

        return this;
    }

    /**
     * Creates standard card
     * @param {string} title
     * @param {string} text
     * @param {string} smallImageUrl
     * @param {string} largeImageUrl
     * @return {CardBuilder}
     */
    createStandardCard(title, text, smallImageUrl, largeImageUrl) {
        if (smallImageUrl.substr(0, 5) !== 'https' ||
            largeImageUrl.substr(0, 5) !== 'https') {
            throw new Error('Url must be https');
        }
        this.card = {
            type: 'Standard',
            title: title,
            text: text,
            image: {
                smallImageUrl: smallImageUrl,
                largeImageUrl: largeImageUrl,
            },
        };

        return this;
    }

    /**
     * Creates accountlinking card
     * @return {CardBuilder}
     */
    createLinkAccountCard() {
        this.card = {
            type: 'LinkAccount',
        };

        return this;
    }

    /**
     * Creates ask for permissions card
     * Valid permissions:
     * read::alexa:household:list
     * write::alexa:household:list
     * read::alexa:device:all:address
     * read::alexa:device:all:address:country_and_postal_code
     * @param {Array} permissions
     * @return {CardBuilder} Cardbuilder
     */
    createAskFromPermissionConsent(permissions) {
        this.card = {
            type: 'AskForPermissionsConsent',
            permissions: permissions,
        };
        return this;
    }


    /**
     * Creates ask for list permissions card
     * @param {Array} types 'read', 'write'
     * @return {CardBuilder}
     */
    createAskForListPermissions(types) {
        let permissions = [];
        for (let obj of types) {
            if (obj !== 'read' && obj !== 'write') {
                throw new Error('Invalid permission type');
            }
            permissions.push(obj+'::alexa:household:list');
        }
        return this.createAskFromPermissionConsent(
            permissions
        );
    }

    /**
     * Creates ask for location permission cards
     * @param {'address'|'country_and_postal_code'} type
     * @return {CardBuilder}
     */
    createAskForLocationPermissions(type) {
        if (type !== 'address' && type !== 'country_and_postal_code') {
            throw new Error('Invalid permission type');
        }
        let permission = type === 'address' ?
            'address' : 'address:country_and_postal_code';
        return this.createAskFromPermissionConsent(
            ['read::alexa:device:all:'+permission]
        );
    }

    /**
     * Returns card object
     * @return {object}
     */
    build() {
        return this.card;
    }

}


module.exports.AlexaCardBuilder = AlexaCardBuilder;
