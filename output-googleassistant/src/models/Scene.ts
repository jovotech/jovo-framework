import {
  EnumLike,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';

export class NextScene {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export enum SlotFillingStatus {
  Unspecified = 'UNSPECIFIED',
  Initialized = 'INITIALIZED',
  Collecting = 'COLLECTING',
  Final = 'FINAL',
}

export type SlotFillingStatusLike = EnumLike<SlotFillingStatus>;

export class Scene {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEnum(SlotFillingStatus)
  slotFillingStatus?: SlotFillingStatusLike;

  @IsObject()
  slots: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => NextScene)
  next?: NextScene;
}
