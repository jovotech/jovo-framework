"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const AlexaSkill_1 = require("../core/AlexaSkill");
const jovo_core_1 = require("jovo-core");
const index_1 = require("../index");
class AudioPlayer {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
        this.playerActivity = _get(alexaSkill.$request, 'context.AudioPlayer.playerActivity');
        this.offsetInMilliseconds = _get(alexaSkill.$request, 'context.AudioPlayer.offsetInMilliseconds');
        this.token =
            _get(alexaSkill.$request, 'context.AudioPlayer.token') ||
                _get(alexaSkill.$request, 'request.token');
    }
    /**
     * Play audio file
     * @param {string} url
     * @param {string} token
     * @param {'ENQUEUE'|'REPLACE_ALL'|'REPLACE_ENQUEUED'} playBehavior
     * @return {Jovo}
     */
    play(url, token, playBehavior = AudioPlayer.PLAYBEHAVIOR_REPLACE_ALL) {
        const audioItem = {
            stream: {
                url,
                token,
                offsetInMilliseconds: this.offsetInMilliseconds,
            },
        };
        if (this.expectedPreviousToken) {
            audioItem.stream.expectedPreviousToken = this.expectedPreviousToken;
        }
        if (this.metaData) {
            audioItem.metadata = this.metaData;
        }
        _set(this.alexaSkill.$output, 'Alexa.AudioPlayer', new AudioPlayerPlayDirective(playBehavior, audioItem));
        return this.alexaSkill;
    }
    /**
     * Stops audio stream immediately
     * @return {Jovo}
     */
    stop() {
        _set(this.alexaSkill.$output, 'Alexa.AudioPlayer', new AudioPlayerStopDirective());
        return this.alexaSkill;
    }
    /**
     * Clear que
     * @param {'CLEAR_ENQUEUED'|'CLEAR_ALL'} clearBehavior
     * @return {Jovo}
     */
    clearQueue(clearBehavior = AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ALL) {
        _set(this.alexaSkill.$output, 'Alexa.AudioPlayer', new AudioPlayerClearQueueDirective(clearBehavior));
        return this.alexaSkill;
    }
    /**
     * Enqueues file
     * @param {string} url
     * @param {string} token
     * @return {Jovo}
     */
    enqueue(url, token) {
        return this.play(url, token, AudioPlayer.PLAYBEHAVIOR_ENQUEUE);
    }
    /**
     * Start file from beginning
     * @param {string} url
     * @param {string} token
     * @return {Jovo}
     */
    startOver(url, token) {
        return this.setOffsetInMilliseconds(0).play(url, token, AudioPlayer.PLAYBEHAVIOR_ENQUEUE);
    }
    /**
     * Return offsetInMilliseconds
     * @return {number}
     */
    getOffsetInMilliseconds() {
        return this.offsetInMilliseconds;
    }
    /**
     * Adds offset in ms to audio item
     * @param {number} offsetInMilliseconds
     * @return {AudioPlayerPlugin}
     */
    setOffsetInMilliseconds(offsetInMilliseconds) {
        this.offsetInMilliseconds = offsetInMilliseconds;
        return this;
    }
    /**
     * Adds expectedPreviousToken to audio item
     * @link https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference#play // eslint-disable-line no-use-before-define
     * @param {string} expectedPreviousToken
     * @return {AudioPlayerPlugin}
     */
    setExpectedPreviousToken(expectedPreviousToken) {
        this.expectedPreviousToken = expectedPreviousToken;
        return this;
    }
    /**
     * Returns token
     * @return {string}
     */
    getToken() {
        return this.token;
    }
    /**
     * Sets the meta data for the track
     * @param {MetaData} metaData
     * @return {AudioPlayerPlugin}
     */
    setMetaData(metaData) {
        this.metaData = metaData;
    }
    /**
     * Adds a track title to be displayed
     * @param {string} title
     * @return {AudioPlayerPlugin}
     */
    setTitle(title) {
        if (!this.metaData) {
            this.metaData = {};
        }
        _set(this.metaData, 'title', title);
        return this;
    }
    /**
     * Adds a track subtitle to be displayed
     * @param {string} subtitle
     * @return {AudioPlayerPlugin}
     */
    setSubtitle(subtitle) {
        if (!this.metaData) {
            this.metaData = {};
        }
        _set(this.metaData, 'subtitle', subtitle);
        return this;
    }
    /**
     * Adds a track image
     * @param {string} url
     * @return {AudioPlayerPlugin}
     */
    addArtwork(url) {
        if (!this.metaData) {
            this.metaData = {};
        }
        _set(this.metaData, 'art', {
            sources: [{ url }],
        });
        return this;
    }
    /**
     * Adds an image to be displayed behind the track information
     * @param {string} url
     * @return {AudioPlayerPlugin}
     */
    addBackgroundImage(url) {
        if (!this.metaData) {
            this.metaData = {};
        }
        _set(this.metaData, 'backgroundImage', {
            sources: [{ url }],
        });
        return this;
    }
    /**
     * Adds an image to be displayed behind the track information
     * @deprecated Please use addBackgroundImage instead
     * @param {string} url
     * @return {AudioPlayerPlugin}
     */
    addBackground(url) {
        if (!this.metaData) {
            this.metaData = {};
        }
        _set(this.metaData, 'backgroundImage', {
            sources: [{ url }],
        });
        return this;
    }
}
exports.AudioPlayer = AudioPlayer;
AudioPlayer.PLAYBEHAVIOR_REPLACE_ALL = 'REPLACE_ALL';
AudioPlayer.PLAYBEHAVIOR_ENQUEUE = 'ENQUEUE';
AudioPlayer.PLAYBEHAVIOR_REPLACE_ENQUEUED = 'REPLACE_ENQUEUED';
class AudioPlayerPlugin {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.$audioPlayer = undefined;
        AlexaSkill_1.AlexaSkill.prototype.audioPlayer = function () {
            return this.$audioPlayer;
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type').substring(0, 11) === 'AudioPlayer') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.AUDIOPLAYER,
                subType: 'AlexaSkill.' + _get(alexaRequest, 'request.type').substring(12),
            };
        }
        alexaSkill.$audioPlayer = new AudioPlayer(alexaSkill);
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new index_1.AlexaResponse();
        }
        if (alexaSkill.$request.hasAudioInterface()) {
            if (_get(output, 'Alexa.AudioPlayer')) {
                const directives = _get(alexaSkill.$response, 'response.directives', []);
                directives.push(_get(output, 'Alexa.AudioPlayer'));
                _set(alexaSkill.$response, 'response.directives', directives);
            }
        }
    }
}
exports.AudioPlayerPlugin = AudioPlayerPlugin;
class AudioPlayerDirective {
    constructor(type) {
        this.type = type;
    }
}
class AudioPlayerPlayDirective extends AudioPlayerDirective {
    constructor(playBehavior, audioItem) {
        super('AudioPlayer.Play');
        this.playBehavior = playBehavior;
        this.audioItem = audioItem;
    }
    setPlayBehavior(playBehavior) {
        this.playBehavior = playBehavior;
    }
    setAudioItem(audioItem) {
        this.audioItem = audioItem;
    }
}
class AudioPlayerStopDirective extends AudioPlayerDirective {
    constructor() {
        super('AudioPlayer.Stop');
    }
}
class AudioPlayerClearQueueDirective extends AudioPlayerDirective {
    constructor(clearBehavior) {
        super('AudioPlayer.ClearQueue');
        this.clearBehavior = clearBehavior;
    }
    setClearBehavior(clearBehavior) {
        this.clearBehavior = clearBehavior;
    }
    clearAll() {
        this.clearBehavior = AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ALL;
        return this;
    }
    clearEnqueued() {
        this.clearBehavior = AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ENQUEUED;
        return this;
    }
}
AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ALL = 'CLEAR_ALL';
AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ENQUEUED = 'CLEAR_ENQUEUED';
//# sourceMappingURL=AudioPlayerPlugin.js.map