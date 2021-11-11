import {
  formatValidationErrors,
  IsEitherValid,
  isEnum,
  IsEnum,
  IsOptional,
  JovoResponse,
  Type,
  validate,
  ValidateNested,
} from '@jovotech/output';
import { IdentityData, Message } from './output';

export enum MessagingType {
  Response = 'RESPONSE',
  Update = 'UPDATE',
  MessageTag = 'MESSAGE_TAG',
}

export enum SenderActionType {
  MarkSeen = 'mark_seen',
  TypingOn = 'typing_on',
  TypingOff = 'typing_off',
}

export enum NotificationType {
  Regular = 'REGULAR',
  SilentPush = 'SILENT_PUSH',
  NoPush = 'NO_PUSH',
}

export enum MessageTag {
  ConfirmedEventUpdate = 'CONFIRMED_EVENT_UPDATE',
  PostPurchaseUpdate = 'POST_PURCHASE_UPDATE',
  AccountUpdate = 'ACCOUNT_UPDATE',
  HumanAgent = 'HUMAN_AGENT',
}

export class FacebookMessengerResponse extends JovoResponse {
  [key: string]: unknown;

  @IsEnum(MessagingType)
  messaging_type!: MessagingType;

  @ValidateNested()
  @Type(() => IdentityData)
  recipient!: IdentityData;

  @IsEitherValid<FacebookMessengerResponse>({
    keys: ['message', 'sender_action'],
    validate: async (value) => {
      if (!(value instanceof Message)) {
        return '$property must be an instance of Message';
      }
      const errors = await validate(value);
      if (errors.length) {
        return formatValidationErrors(errors, {
          text: '$property is invalid:',
          delimiter: '\n  - ',
          path: '$property',
        });
      }
    },
  })
  @Type(() => Message)
  message?: Message;

  @IsEitherValid<FacebookMessengerResponse>({
    keys: ['message', 'sender_action'],
    validate: (value) => {
      if (!isEnum(value, SenderActionType)) {
        return '$property must be a valid enum value';
      }
    },
  })
  sender_action?: SenderActionType;

  @IsOptional()
  @IsEnum(NotificationType)
  notification_type?: NotificationType;

  @IsOptional()
  @IsEnum(MessageTag)
  tag?: MessageTag;

  hasSessionEnded(): boolean {
    return false;
  }
}
