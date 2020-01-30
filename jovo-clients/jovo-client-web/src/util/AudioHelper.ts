export class AudioHelper {
  static textFromSpeechRecognition(event: SpeechRecognitionEvent): string {
    let text = '';
    for (let i = 0, len = event.results.length; i < len; i++) {
      text += event.results[i][0].transcript;
    }
    return text;
  }
}
