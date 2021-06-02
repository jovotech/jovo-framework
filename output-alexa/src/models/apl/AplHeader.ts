import { IsNotEmpty, IsString } from '@jovotech/output';

export class AplHeader {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  logo: string;
}
