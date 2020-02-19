import { CoreComponent, JovoWebClient, RequestEvents } from '..';

const TAG_AUDIO = 'audio';
const TAG_BREAK = 'break';

const SUPPORTED_TAGS = [TAG_AUDIO, TAG_BREAK];

export class SSMLEvaluator extends CoreComponent {
  get supportedTags(): string[] {
    return SUPPORTED_TAGS;
  }

  static ESCAPE_AMPERSAND = true;

  /**
   * Adds <speak> tags to a string. Replaces & with and (v1 compatibility)
   * @param {string} text
   * @returns {string}
   */
  static toSSML(text: string): string {
    text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
    text = '<speak>' + text + '</speak>';

    if (SSMLEvaluator.ESCAPE_AMPERSAND) {
      // workaround (v1 compatibility)
      text = text.replace(/&/g, 'and');
    }

    return text;
  }

  /**
   * Removes everything that is surrounded by <>
   * @param {string} ssml
   * @param keepTags
   * @returns {string}
   */
  static removeSSML(ssml: string, keepTags?: string[]): string {
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

  /**
   * Removes <speak> tags from string
   * @param {string} ssml
   * @returns {string}
   */
  static removeSpeakTags(ssml: string): string {
    return ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
  }

  static getSSMLParts(ssml: string): string[] {
    const regex = /(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g;
    const supportedSSMLOnly = SSMLEvaluator.removeSSML(ssml, SUPPORTED_TAGS);
    const parts: string[] = [];
    supportedSSMLOnly.split(regex).forEach((part: string) => {
      if (part && part.trim().length > 0) {
        parts.push(part);
      }
    });
    return parts;
  }

  // returns the amount in milliseconds (used in timers)
  static getBreakTime(breakSSML: string): number {
    const regex = /<break[^>]*time\s*=\s*"(.*)"/g;
    const match = regex.exec(breakSSML);
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

  static getAudioSource(audioSSML: string): string {
    const regex = /<audio[^>]*src\s*=\s*"(.*)"/g;
    const match = regex.exec(audioSSML);
    if (match) {
      return match[1];
    }
    return '';
  }

  static isAudioTag(ssml: string): boolean {
    return /(?:(<audio[^>]*[/]>)|(<audio[^>]*>.*?<[/][^>]*>))/g.test(ssml);
  }

  static isSupportedTag(ssml: string): boolean {
    for (const tag of SUPPORTED_TAGS) {
      const doesMatch = new RegExp(`(?:(<${tag}[^>]*[/]>)|(<${tag}[^>]*>.*?<[/][^>]*>))`, 'g').test(
        ssml,
      );
      if (doesMatch) {
        return true;
      }
    }
    return false;
  }

  static getTag(ssml: string): string | undefined {
    const regexp = /<\s*([^>/\s]+)/g;
    const matches = regexp.exec(ssml);
    if (matches) {
      return matches[1];
    }
    return undefined;
  }

  static isPlainText(ssml: string): boolean {
    return !/(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g.test(ssml);
  }

  readonly name = 'SSMLEvaluator';
  private $isRunning = false;

  constructor(protected readonly $client: JovoWebClient) {
    super($client);
    $client.on(RequestEvents.Data, () => {
      this.$isRunning = false;
    });
  }

  evaluate(ssml: string): Promise<void> {
    this.$isRunning = true;
    return new Promise(async (resolve, reject) => {
      const ssmlParts = SSMLEvaluator.getSSMLParts(ssml);
      for (let i = 0, len = ssmlParts.length; i < len; i++) {
        if (this.$isRunning) {
          if (
            this.$client.$config.speechSynthesis.enabled &&
            SSMLEvaluator.isPlainText(ssmlParts[i])
          ) {
            await this.$client.speechSynthesizer.speakText(ssmlParts[i]);
          } else if (SSMLEvaluator.isSupportedTag(ssmlParts[i])) {
            await this.evaluatePart(ssmlParts[i]);
          }
        }
      }
      this.$isRunning = false;
      resolve();
    });
  }

  private evaluatePart(part: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      switch (SSMLEvaluator.getTag(part)) {
        case TAG_AUDIO:
          const source = SSMLEvaluator.getAudioSource(part);
          if (this.$client.$config.audioPlayer.enabled) {
            await this.$client.audioPlayer.play(source);
          }
          break;
        case TAG_BREAK:
          const amount = SSMLEvaluator.getBreakTime(part);
          await new Promise((resolveBreak) => {
            setTimeout(() => {
              resolveBreak();
            }, amount);
          });
          break;
        default:
      }
      resolve();
    });
  }
}
