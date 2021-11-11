import { EnumLike } from '@jovotech/framework';
import { IsEnum, IsObject, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { IsValidMessageContentObject } from '../decorators/validation/IsValidMessageContentObject';
import { Card } from './message/Card';
import { Image } from './message/Image';
import { QuickReplies } from './message/QuickReplies';
import { RbmCarouselCard } from './message/rbm/RbmCarouselCard';
import { RbmStandaloneCard } from './message/rbm/RbmStandaloneCard';
import { RbmText } from './message/rbm/RbmText';
import { TelephonyPlayAudio } from './message/telephony/TelephonyPlayAudio';
import { TelephonySynthesizeSpeech } from './message/telephony/TelephonySynthesizeSpeech';
import { TelephonyTransferCall } from './message/telephony/TelephonyTransferCall';
import { Text } from './message/Text';

export enum Platform {
  Unspecified = 'PLATFORM_UNSPECIFIED',
  Facebook = 'FACEBOOK',
  Slack = 'SLACK',
  Telegram = 'TELEGRAM',
  Kik = 'KIK',
  Skype = 'SKYPE',
  Line = 'LINE',
  Viber = 'VIBER',
  ActionsOnGoogle = 'ACTIONS_ON_GOOGLE',
  Telephony = 'TELEPHONY',
  GoogleHangouts = 'GOOGLE_HANGOUTS',
}

export type PlatformLike = EnumLike<Platform>;

export class Message {
  @IsOptional()
  @IsEnum(Platform)
  platform?: PlatformLike;

  @IsObject()
  @ValidateNested()
  @Type(() => MessageContent)
  message!: MessageContent;
}

export class MessageContent<P extends Record<string, unknown> = Record<string, unknown>> {
  @IsValidMessageContentObject()
  @Type(() => Text)
  text?: Text;

  @IsValidMessageContentObject()
  @Type(() => Image)
  image?: Image;

  @IsValidMessageContentObject()
  @Type(() => QuickReplies)
  quick_replies?: QuickReplies;

  @IsValidMessageContentObject()
  @Type(() => Card)
  card?: Card;

  @IsValidMessageContentObject()
  payload?: P;

  @IsValidMessageContentObject()
  simple_responses?: Record<string, unknown>;

  @IsValidMessageContentObject()
  basic_card?: Record<string, unknown>;

  @IsValidMessageContentObject()
  suggestions?: Record<string, unknown>;

  @IsValidMessageContentObject()
  link_out_suggestion?: Record<string, unknown>;

  @IsValidMessageContentObject()
  list_select?: Record<string, unknown>;

  @IsValidMessageContentObject()
  carousel_select?: Record<string, unknown>;

  @IsValidMessageContentObject()
  @Type(() => TelephonyPlayAudio)
  telephony_play_audio?: TelephonyPlayAudio;

  @IsValidMessageContentObject()
  @Type(() => TelephonySynthesizeSpeech)
  telephony_synthesize_speech?: TelephonySynthesizeSpeech;

  @IsValidMessageContentObject()
  @Type(() => TelephonyTransferCall)
  telephony_transfer_call?: TelephonyTransferCall;

  @IsValidMessageContentObject()
  @Type(() => RbmText)
  rbm_text?: RbmText;

  @IsValidMessageContentObject()
  @Type(() => RbmStandaloneCard)
  rbm_standalone_rich_card?: RbmStandaloneCard;

  @IsValidMessageContentObject()
  @Type(() => RbmCarouselCard)
  rbm_carousel_rich_card?: RbmCarouselCard;

  @IsValidMessageContentObject()
  browse_carousel_card?: Record<string, unknown>;

  @IsValidMessageContentObject()
  table_card?: Record<string, unknown>;

  @IsValidMessageContentObject()
  media_content?: Record<string, unknown>;
}
