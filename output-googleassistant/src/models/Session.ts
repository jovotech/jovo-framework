import {
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

export class TypeOverride {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeOverrideMode)
  mode: TypeOverrideMode;

  @IsOptional()
  @ValidateNested()
  @Type(() => SynonymType)
  synonym?: SynonymType;
}

export class Session {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsObject()
  params: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TypeOverride)
  typeOverrides?: TypeOverride[];

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
