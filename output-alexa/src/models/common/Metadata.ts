import { IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class Metadata {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;
}
