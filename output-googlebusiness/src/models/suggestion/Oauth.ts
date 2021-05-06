import { IsArray, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class Oauth {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  codeChallenge: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  scopes: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  codeChallengeMethod?: string;
}
