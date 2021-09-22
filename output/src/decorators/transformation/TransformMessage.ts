import { Message, plainToClass, SpeechMessage, TextMessage, Transform } from '../..';

export function TransformMessage(): PropertyDecorator {
  return Transform(({ value }: { value: Message }) => {
    if (value?.speech) {
      return plainToClass(SpeechMessage, value);
    }
    if (value?.text) {
      return plainToClass(TextMessage, value);
    }
    return plainToClass(Message, value);
  }) as PropertyDecorator;
}
