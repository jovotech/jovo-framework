import { IsNotEmpty, IsString, Type, ValidateNested } from '@jovotech/output';
import { TextLink } from './TextLink';

export class DisclosureText {
  @IsString()
  @IsNotEmpty()
  template!: string;

  @ValidateNested({
    each: true,
  })
  @Type(() => TextLink)
  textLinks!: TextLink[];
}
