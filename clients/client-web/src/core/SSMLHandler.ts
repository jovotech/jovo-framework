import { Client, delay } from '..';

export const TAG_AUDIO = 'audio';
export const TAG_BREAK = 'break';

export const SUPPORTED_TAGS = [TAG_AUDIO, TAG_BREAK];

export class SSMLHandler {
  constructor(readonly client: Client) {}

  isPlainText(ssml: string): boolean {
    return !/(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g.test(ssml);
  }

  isSupportedTag(ssml: string): boolean {
    return SUPPORTED_TAGS.some((tag) => {
      return new RegExp(`(?:(<${tag}[^>]*[/]>)|(<${tag}[^>]*>.*?<[/][^>]*>))`, 'g').test(ssml);
    });
  }

  async handleSSML(ssml: string) {
    const ssmlParts = this.getSSMLParts(ssml);
    for (let i = 0, len = ssmlParts.length; i < len; i++) {
      if (this.isPlainText(ssmlParts[i])) {
        await this.client.speechSynthesizer.speak(ssmlParts[i]);
      } else if (this.isSupportedTag(ssmlParts[i])) {
        await this.handleSSMLPart(ssmlParts[i]);
      }
    }
  }

  removeSSML(ssml: string, keepTags?: string[]): string {
    let noSSMLText = ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');

    let regexPattern = '<[^>]*>';
    if (keepTags && keepTags.length > 0) {
      let exclusionPattern = '';
      keepTags.forEach((tag: string) => {
        exclusionPattern += `(?![/]?${tag})`;
      });
      regexPattern = `<${exclusionPattern}[^>]*[^>]*>`;
    }
    noSSMLText = noSSMLText.replace(new RegExp(regexPattern, 'g'), '');
    return noSSMLText;
  }

  private async handleSSMLPart(part: string) {
    switch (this.getTag(part)) {
      case TAG_AUDIO:
        const audioSource = this.getAudioSource(part);
        return this.client.audioPlayer.play(audioSource);
      case TAG_BREAK:
        const amount = this.getBreakTime(part);
        if (amount) {
          return delay(amount);
        }
        return;
    }
  }

  private getTag(ssml: string): string | undefined {
    const regexp = /<\s*([^>/\s]+)/g;
    const matches = regexp.exec(ssml);
    return matches?.[1];
  }

  private getAudioSource(ssml: string): string {
    const regex = /<audio[^>]*src\s*=\s*"(.*)"/g;
    const match = regex.exec(ssml);
    return match?.[1] || '';
  }

  private getBreakTime(ssml: string): number {
    const regex = /<break[^>]*time\s*=\s*"(.*)"/g;
    const match = regex.exec(ssml);
    if (match) {
      const rawValue = match[1];
      let value = 0;
      if (rawValue.endsWith('ms')) {
        value = +rawValue.replace('ms', '');
      } else if (rawValue.endsWith('s')) {
        value = +rawValue.replace('s', '') * 1000;
      }
      return value;
    }
    return 0;
  }

  private getSSMLParts(ssml: string): string[] {
    const regex = /(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g;
    const supportedSSMLOnly = this.removeSSML(ssml, SUPPORTED_TAGS);
    return supportedSSMLOnly.split(regex).filter((part) => {
      return part?.trim().length;
    });
  }
}
