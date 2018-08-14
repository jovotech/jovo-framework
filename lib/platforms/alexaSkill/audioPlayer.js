'use strict';

/**
 * Class AudioPlayer
 */
class AudioPlayer {

    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
        let audioPlayerRequest = jovo.alexaSkill().getRequest();
        this.token = audioPlayerRequest.getAudioPlayerToken();
        this.playerActivity = audioPlayerRequest.getAudioPlayerActivity();
        this.offsetInMilliseconds = audioPlayerRequest.getAudioPlayerOffsetInMilliseconds();
        this.type = audioPlayerRequest.getType();
        this.response = jovo.alexaSkill().getResponse();
    }

    /**
     * Returns player activity
     * @return {string|*}
     */
    getPlayerActivity() {
        return this.playerActivity;
    }
    /**
     * Returns type of audioplayer request
     * @return {string}
     */
    getType() {
        return this.type;
    }

    /**
     * Returns token
     * @return {string}
     */
    getToken() {
        return this.token;
    }

    /**
     * Return offsetInMilliseconds
     * @return {number}
     */
    getOffsetInMilliseconds() {
        return this.offsetInMilliseconds;
    }

    /**
     * Plays audio file
     * @param {string} url
     * @param {string} token
     * @param {'ENQUEUE'|'REPLACE_ALL'|'REPLACE_ENQUEUED'} playBehavior
     * @return {Jovo}
     */
    play(url, token, playBehavior) {
        if (!playBehavior) {
            playBehavior = 'REPLACE_ALL';
        }
        this.response.audioPlayerPlay(playBehavior, this.createAudioItem(url, token));
        if (this.jovo.isAudioPlayerRequest() || this.jovo.isPlaybackControllerRequest()) {
            this.jovo.emit('respond', this.jovo);
        } else {
            return this.jovo;
        }
    }

    /**
     * Enqueues file
     * @param {string} url
     * @param {string} token
     * @return {Jovo}
     */
    enqueue(url, token) {
        return this.setOffsetInMilliseconds(0).play(url, token, 'ENQUEUE');
    }

    /**
     * Start file from beginning
     * @param {string} url
     * @param {string} token
     * @return {Jovo}
     */
    startOver(url, token) {
        return this.setOffsetInMilliseconds(0).play(url, token);
    }

    /**
     * Stops audio stream
     * @return {Jovo}
     */
    stop() {
        this.response.audioPlayerStop();
        if (this.jovo.isAudioPlayerRequest() || this.jovo.isPlaybackControllerRequest()) {
            this.jovo.emit('respond', this.jovo);
        } else {
            return this.jovo;
        }
    }

    /**
     * Clear
     * @param {'CLEAR_ENQUEUED'|'CLEAR_ALL'} clearBehavior
     * @return {Jovo}
     */
    clearQueue(clearBehavior) {
        if (!clearBehavior) {
            clearBehavior = 'CLEAR_ALL';
        }
        this.response.audioPlayerClearQueue(clearBehavior);

        if (this.jovo.isAudioPlayerRequest() || this.jovo.isPlaybackControllerRequest()) {
            this.jovo.emit('respond', this.jovo);
        } else {
            return this.jovo;
        }
    }

    /**
     * Creates Audio item
     * @param {string} url
     * @param {string} token
     * @return {*}
     */
    createAudioItem(url, token) {
        let audioItem = {
            stream: {
                token: token,
                url: url,
                offsetInMilliseconds: this.offsetInMilliseconds,
            },
        };

        if (this.expectedPreviousToken) {
            audioItem.stream.expectedPreviousToken = this.expectedPreviousToken;
        }

        if (this.metadata) {
            audioItem.metadata = this.metadata;
        }

        return audioItem;
    }

    /**
     * Adds a track title to be displayed
     * @param {string} title
     * @return {AudioPlayer}
     */
    setTitle(title) {
        if (!this.metadata) {
            this.metadata = {};
        }

        this.metadata.title = title;
        return this;
    }

    /**
     * Adds a track subtitle to be displayed
     * @param {string} subtitle
     * @return {AudioPlayer}
     */
    setSubtitle(subtitle) {
        if (!this.metadata) {
            this.metadata = {};
        }

        this.metadata.subtitle = subtitle;
        return this;
    }

    /**
     * Adds a track image
     * @param {string} url
     * @return {AudioPlayer}
     */
    addArtwork(url) {
        if (!this.metadata) {
            this.metadata = {};
        }

        if (!this.metadata.art) {
            this.metadata.art = {sources: []};
        }

        this.metadata.art.sources.push({url});
        return this;
    }

    /**
     * Adds an image to be displayed behind the track information
     * @param {string} url
     * @return {AudioPlayer}
     */
    addBackgroundImage(url) {
        if (!this.metadata) {
            this.metadata = {};
        }

        if (!this.metadata.backgroundImage) {
            this.metadata.backgroundImage = {sources: []};
        }

        this.metadata.backgroundImage.sources.push({url});
        return this;
    }


    /**
     * Adds offset in ms to audio item
     * @param {number} offsetInMilliseconds
     * @return {AudioPlayer}
     */
    setOffsetInMilliseconds(offsetInMilliseconds) {
        this.offsetInMilliseconds = offsetInMilliseconds;
        return this;
    }

    /*eslint-disable */
    /**
     * Adds expectedPreviousToken to audio item
     * @link https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference#play // eslint-disable-line no-use-before-define
     * @param {string} expectedPreviousToken
     * @return {AudioPlayer}
     */
    setExpectedPreviousToken(expectedPreviousToken) {
        this.expectedPreviousToken = expectedPreviousToken;
        return this;
    }
    /*eslint-enable */
}

module.exports.AudioPlayer = AudioPlayer;
