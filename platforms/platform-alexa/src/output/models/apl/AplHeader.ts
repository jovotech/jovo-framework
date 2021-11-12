import { IsNotEmpty, IsString, IsUrl } from '@jovotech/output';

export class AplHeader {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsUrl()
  logo!: string;
}
