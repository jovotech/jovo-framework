export class SsmlUtilities {
  static isPlainText(ssml: string): boolean {
    return !/(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g.test(ssml);
  }

  static buildAudioTag(src: string): string {
    return `<audio src="${src}"/>`;
  }

  static isSSML(text: string): boolean {
    return /^<speak>.*<\/speak>$/.test(text);
  }

  static toSSML(text: string): string {
    text = text.replace(/<[/]?speak>/g, '');
    return `<speak>${text}</speak>`;
  }

  static removeSSMLSpeakTags(ssml: string): string {
    return ssml.replace(/<[/]?speak>/g, '');
  }

  static removeSSML(ssml: string): string {
    return ssml.replace(/<[^>]*>/g, '');
  }
}
