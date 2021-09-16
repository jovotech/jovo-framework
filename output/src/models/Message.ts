import { IsSomeValid, isString } from '..';

export type MessageValue = string | SpeechMessage | TextMessage;

export const IsValidMessageString = () =>
  IsSomeValid<Message>({
    keys: ['speech', 'text'],
    validate: (value, args) => {
      if (!isString(value)) {
        return '$property must be a string';
      }
      if (!value) {
        return '$property should not be empty';
      }
      return;
    },
  });

export class Message {
  @IsValidMessageString()
  speech?: string;

  @IsValidMessageString()
  text?: string;
}

export class SpeechMessage extends Message {
  speech: string;
}

export class TextMessage extends Message {
  text: string;
}
