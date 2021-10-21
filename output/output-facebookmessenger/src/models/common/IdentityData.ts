import { IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class IdentityData {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  user_ref?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  post_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment_id?: string;
}
