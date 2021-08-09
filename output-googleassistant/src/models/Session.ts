import {
  EnumLike,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Image } from './common/Image';
import { OpenUrl } from './common/OpenUrl';

export class EntryDisplay {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  footer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OpenUrl)
  openUrl?: OpenUrl;
}

export class Entry {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  synonyms: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => EntryDisplay)
  display?: EntryDisplay;
}

export class SynonymType {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Entry)
  entries: Entry[];
}

export enum TypeOverrideMode {
  Unspecified = 'TYPE_UNSPECIFIED',
  Replace = 'TYPE_REPLACE',
  Merge = 'TYPE_MERGE',
}

export type TypeOverrideModeLike = EnumLike<TypeOverrideMode>;

export class SessionParamsReprompts {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  NO_INPUT_1?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  NO_INPUT_2?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  NO_INPUT_FINAL?: string;
}

export class SessionParams {
  [key: string]: unknown;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SessionParamsReprompts)
  _GA_REPROMPTS_?: SessionParamsReprompts;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  _GA_SELECTION_INTENT_?: string;
}

export class TypeOverride {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeOverrideMode)
  typeOverrideMode: TypeOverrideModeLike;

  @IsOptional()
  @ValidateNested()
  @Type(() => SynonymType)
  synonym?: SynonymType;
}

export class Session {
  @IsString()
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SessionParams)
  params: SessionParams;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TypeOverride)
  typeOverrides?: TypeOverride[];

  @IsString()
  languageCode: string;
}
