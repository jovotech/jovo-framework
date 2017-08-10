/**
 * Class AudioPlayer
 */
class AudioPlayer {

    /**
     * constructor
     * @param {Jovo} jovo
     * @param {object} responseObj
     * @param {object} request
     */
    constructor(jovo, responseObj, request) {
        this.jovo = jovo;
        this.playerActivity = request.context.AudioPlayer.playerActivity;
        if (request.context.AudioPlayer.token) {
            this.token = request.context.AudioPlayer.token;
        } else {
            this.token = request.request.token;
        }

        if (request.context.AudioPlayer.offsetInMilliseconds) {
            this.offsetInMilliseconds = request.context
                .AudioPlayer.offsetInMilliseconds;
        } else {
            this.offsetInMilliseconds = request.request.offsetInMilliseconds;
        }

        this.type = request.request.type;

        this.responseObj = responseObj;
        this.responseObj.response.directives = [];
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
     */
    play(url, token, playBehavior) {
        if (!playBehavior) {
            playBehavior = 'REPLACE_ALL';
        }

        let directive = {
            type: 'AudioPlayer.Play',
            playBehavior: playBehavior,
            audioItem: this.createAudioItem(url, token),
        };
        this.responseObj.response.directives.push(directive);
        console.log('++++++++++++++++++++++++++++++++');
        console.log(JSON.stringify(this.responseObj, null, '\t'));
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Stops audio stream
     */
    stop() {
        let directive = {
            type: 'AudioPlayer.Stop',
        };
        this.responseObj.response.directives.push(directive);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Clear
     * @param {'CLEAR_ENQUEUED'|'CLEAR_ALL'} clearBehavior
     */
    clearQueue(clearBehavior) {
        if (!clearBehavior) {
            clearBehavior = 'CLEAR_ALL';
        }

        let directive = {
            type: 'AudioPlayer.ClearQueue',
            clearBehavior: clearBehavior,
        };
        this.responseObj.response.directives.push(directive);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Creates Audio item
     * @param {string} url
     * @param {string} token
     * @return {*}
     */
    createAudioItem(url, token) {
        let stream = {
            stream: {
                token: token,
                url: url,
                offsetInMilliseconds: 10000, //this.offsetInMilliseconds,
            },
        };

        if (this.expectedPreviousToken) {
            stream.stream.expectedPreviousToken = this.expectedPreviousToken;
        }

        return stream;
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
