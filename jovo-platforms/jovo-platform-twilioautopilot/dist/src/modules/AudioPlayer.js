"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutopilotBot_1 = require("../core/AutopilotBot");
class AudioPlayer {
    constructor(autopilotBot) {
        this.autopilotBot = autopilotBot;
    }
    /**
     * Add an audio file to the response
     * @param {string} url
     * @param {number} loop
     */
    play(url, loop) {
        const audio = {
            url,
            loop,
        };
        this.autopilotBot.$output.Autopilot.AudioPlayer = audio;
    }
}
exports.AudioPlayer = AudioPlayer;
/**
 * @see https://www.twilio.com/docs/autopilot/actions/play
 */
class AudioPlayerPlugin {
    install(autopilot) {
        autopilot.middleware('$output').use(this.output.bind(this));
        AutopilotBot_1.AutopilotBot.prototype.$audioPlayer = undefined;
        AutopilotBot_1.AutopilotBot.prototype.audioPlayer = function () {
            return this.$audioPlayer;
        };
    }
    uninstall(autopilot) { }
    output(autopilotBot) {
        const output = autopilotBot.$output;
        const response = autopilotBot.$response;
        // audio player is only supported on "Voice". Will be ignored on other platforms
        if (output.Autopilot.AudioPlayer) {
            const playAction = output.Autopilot.AudioPlayer;
            response.actions.unshift(playAction);
        }
    }
}
exports.AudioPlayerPlugin = AudioPlayerPlugin;
//# sourceMappingURL=AudioPlayer.js.map