import {
  formatValidationErrors,
  IsEitherValid,
  isEnum,
  IsEnum,
  IsOptional,
  Type,
  validate,
  ValidateNested,
} from '@jovotech/output';
import { IdentityData } from './common/IdentityData';
import {
  FacebookMessengerResponse,
  MessageTag,
  MessagingType,
  NotificationType,
  SenderActionType,
} from '../../FacebookMessengerResponse';
import { Message } from './message/Message';

export class FacebookMessengerOutputTemplateResponse implements Partial<FacebookMessengerResponse> {
  [key: string]: unknown;

  @IsOptional()
  @IsEnum(MessagingType)
  messaging_type?: MessagingType;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdentityData)
  recipient?: IdentityData;

  @IsOptional()
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

  @IsOptional()
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
}
