import { IsNotEmpty, IsString, MaxLength, Type, ValidateNested } from '@jovotech/output';
import { LINK_NAME_MAX_LENGTH } from '../../constants';
import { OpenUrl } from './OpenUrl';

export class Link {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_NAME_MAX_LENGTH)
  name!: string;

  @ValidateNested()
  @Type(() => OpenUrl)
  open!: OpenUrl;
}
