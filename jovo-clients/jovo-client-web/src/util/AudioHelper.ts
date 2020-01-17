export class AudioHelper {
  static textFromSpeechRecognition(event: SpeechRecognitionEvent): string {
    let text = '';
    Array.from(event.results).forEach((result: SpeechRecognitionResult) => {
      text += result[0].transcript;
    });
    return text;
  }
}
