export enum AssistantEvents {
  /** Called when the assistant finished starting */
  Loaded = 'loaded',
  /** Called when the launch-request is being sent  */
  LaunchRequest = 'launch-request',
}

export enum InputEvents {
  /** Called when a text is sent */
  Text = 'input.text',
}

export enum InputRecordEvents {
  /** Called when the audio recorder has successfully started recording */
  Started = 'input.record.started',
  /** Called when the active recording was successfully aborted (No recorded sound will be sent) */
  Aborted = 'input.record.aborted',
  /** Called when the speech-recognition has a match */
  SpeechRecognized = 'input.record.speech-recognized',
  /** Called when the raw audio-data is being processed (Can be useful for graphs/plots) */
  Processing = 'input.record.processing',
  /** Called when silence was detected. (If any sound was recorded) */
  SilenceDetected = 'input.record.silence-detected',
  /** Called when the recorded finished recording */
  Recorded = 'input.record.recorded',
  /** Called when the recorder stopped because nothing was recorded */
  Timeout = 'input.record.timeout',
  /** Called when the recorder has stopped in any way (abort, stop, timeout) */
  Stopped = 'input.record.stopped',
}

export enum LoggerEvents {
  /** Called when the logger processed a log */
  Log = 'logger.log',
}

export enum RequestEvents {
  /** Called when the request failed (error response) */
  Error = 'request.error',
  /** Called when the request succeeded (positive response) */
  Success = 'request.success',
  /** Called when the request-data was created and is about to be sent */
  Data = 'request.data',
  /** Called when the request has any result (error or success) */
  Result = 'request.result',
}

export enum ResponseEvents {
  Action = 'response.action',
  /** Called when a speech-output is about to be processed */
  Speech = 'response.speech',
  /** Called when a reprompt-output is about to be processed */
  Reprompt = 'response.reprompt',
  /** Called when a card is about to be processed */
  Card = 'response.card',
  /** Called when the suggestion chips are about to be processed */
  SuggestionChips = 'response.suggestion-chips',
  QuickReplies = 'response.quick-replies',

  /** Called when the maximum amount of reprompts is reached */
  MaxRepromptsReached = 'response.max-reprompts',
}

export enum StoreEvents {
  /** Called when a new session was created */
  NewSession = 'store.new-session',
}

export enum AudioPlayerEvents {
  Play = 'audio-player.play',
  Pause = 'audio-player.pause',
  Resume = 'audio-player.resume',
  Stop = 'audio-player.stop',
  End = 'audio-player.end',
  Error = 'audio-player.error',
}

export enum SpeechSynthesizerEvents {
  Speak = 'speech-synth.speak',
  Pause = 'speech-synth.pause',
  Resume = 'speech-synth.resume',
  Stop = 'speech-synth.stop',
  End = 'speech-synth.end',
  Error = 'speech-synth.error',
}

export enum ConversationEvents {
  Change = 'conversation.change',
  AddPart = 'conversation.add-part',
}
