import {
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { IsValidRbmSuggestedActionContentObject } from '../../../decorators/validation/IsValidRbmSuggestedActionContentObject';
import { IsValidRbmSuggestionContentObject } from '../../../decorators/validation/IsValidRbmSuggestionContentObject';

export class RbmSuggestion {
  @IsObject()
  @ValidateNested()
  @Type(() => RbmSuggestionContent)
  suggestion: RbmSuggestionContent;
}

export class RbmSuggestionContent {
  @IsValidRbmSuggestionContentObject()
  reply?: RbmSuggestedReply;

  @IsValidRbmSuggestionContentObject()
  action?: RbmSuggestedAction;
}

export class RbmSuggestedReply {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  postback_data: string;
}

export class RbmSuggestedAction extends RbmSuggestedReply {
  @IsObject()
  @ValidateNested()
  @Type(() => RbmSuggestedActionContent)
  action: RbmSuggestedActionContent;
}

export class RbmSuggestedActionContent {
  @IsValidRbmSuggestedActionContentObject()
  dial?: RbmSuggestedActionDial;

  @IsValidRbmSuggestedActionContentObject()
  open_url?: RbmSuggestedActionOpenUri;

  @IsValidRbmSuggestedActionContentObject()
  share_location?: RbmSuggestedActionShareLocation;
}

export class RbmSuggestedActionDial {
  @IsPhoneNumber()
  phone_number: string;
}

export class RbmSuggestedActionOpenUri {
  @IsString()
  @IsNotEmpty()
  uri: string;
}

export class RbmSuggestedActionShareLocation {}
