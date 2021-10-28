import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from '@jovotech/output';

export enum RepresentativeType {
  Unspecified = 'REPRESENTATIVE_TYPE_UNSPECIFIED',
  Bot = 'BOT',
  Human = 'HUMAN',
}
export type RepresentativeTypeLike = RepresentativeType | `${RepresentativeType}`;

export class Representative {
  @IsEnum(RepresentativeType)
  representativeType: RepresentativeTypeLike;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayName?: string;

  @IsOptional()
  @IsUrl()
  avatarImage?: string;
}
