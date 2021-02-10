"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_set_1 = __importDefault(require("lodash.set"));
const jovo_core_1 = require("jovo-core");
const __1 = require("..");
const BixbyResponse_1 = require("../core/BixbyResponse");
class BixbyAudioPlayerPlugin {
    install(bixby) {
        bixby.middleware('$type').use(this.type.bind(this));
        bixby.middleware('$session').use(this.session.bind(this));
        bixby.middleware('$output').use(this.output.bind(this));
        __1.BixbyCapsule.prototype.$audioPlayer = new BixbyAudioPlayer();
    }
    type(capsule) {
        const request = capsule.$request;
        if (request.directive === 'AudioPlaying') {
            capsule.$type = {
                type: jovo_core_1.EnumRequestType.AUDIOPLAYER,
                subType: 'BixbyCapsule.AudioPlaying',
            };
        }
    }
    session(capsule) {
        // Reset AudioPlayer on a new request.
        if (capsule.$type && capsule.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            __1.BixbyCapsule.prototype.$audioPlayer = new BixbyAudioPlayer();
        }
    }
    output(capsule) {
        // TODO necessary?
        if (!capsule.$response) {
            capsule.$response = new BixbyResponse_1.BixbyResponse();
        }
        if (capsule.$audioPlayer && capsule.$audioPlayer.audioItem.length > 0) {
            lodash_set_1.default(capsule.$response, '_JOVO_AUDIO_', capsule.$audioPlayer);
        }
    }
}
exports.BixbyAudioPlayerPlugin = BixbyAudioPlayerPlugin;
class BixbyAudioPlayer {
    constructor() {
        this.category = 'MUSIC';
        this.audioItem = [];
        this.displayName = 'Jovo AudioStream';
        this.doNotWaitForTTS = false;
    }
    setRepeatMode(repeatMode) {
        this.repeatMode = repeatMode;
        return this;
    }
    setDisplayName(displayName) {
        this.displayName = displayName;
        return this;
    }
    waitForTTS(mode) {
        this.setDoNotWaitForTTS(!mode);
        return this;
    }
    setDoNotWaitForTTS(mode) {
        this.doNotWaitForTTS = mode;
        return this;
    }
    setStartAudioItemIndex(index) {
        this.startAudioItemIndex = index;
        return this;
    }
    play(item) {
        this.setAudioStream(item);
        return this;
    }
    enqueue(item) {
        this.addAudioStream(item);
        return this;
    }
    addAudioStream(item) {
        // Create default values for obligatory properties.
        if (!item.title) {
            item.title = 'AudioStream';
        }
        if (!item.artist) {
            item.artist = 'Bixby';
        }
        if (!item.id) {
            item.id = Date.now().toString();
        }
        if (!item.albumArtUrl) {
            item.albumArtUrl = 'https://test.jpg';
        }
        if (item.stream && !item.stream.format) {
            item.stream.format = 'audio/mp3';
        }
        this.audioItem.push(item);
        return this;
    }
    addAudioStreams(items) {
        for (const item of items) {
            this.addAudioStream(item);
        }
        return this;
    }
    setAudioStream(item) {
        this.audioItem = [];
        this.addAudioStream(item);
        return this;
    }
}
exports.BixbyAudioPlayer = BixbyAudioPlayer;
//# sourceMappingURL=BixbyAudioPlayer.js.map