'use strict';

/**
 * Class MediaResponse
 */
class MediaResponse {

    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
        let request = jovo.googleAction().getRequest();
        if (request.getGoogleActionRequest().getMediaStatus()) {
            this.type = 'GoogleAction.' + capitalizeFirstLetter(request.getGoogleActionRequest().getMediaStatus().toLowerCase());
        }
        this.response = jovo.googleAction().getResponse();
    }

    /**
     * Plays audio file
     * @param {string} url
     * @param {string} name
     * @param {*} options
     */
    play(url, name, options) {
        this.response.addMediaResponse(url, name, options);
    }

    /**
     * Returns type of audioplayer request
     * @return {string}
     */
    getType() {
        return this.type;
    }

}

/**
 * Helper function.
 * @param {string} string
 * @return {string}
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports.MediaResponse = MediaResponse;
