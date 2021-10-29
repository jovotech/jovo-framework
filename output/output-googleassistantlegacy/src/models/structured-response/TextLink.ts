import { IsNotEmpty, IsString, IsUrl } from '@jovotech/output';

export class TextLink {
  @IsString()
  @IsNotEmpty()
  displayText: string;

  @IsUrl()
  url: string;
}
