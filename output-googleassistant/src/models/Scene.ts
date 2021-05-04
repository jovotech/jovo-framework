import {
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

export class Scene {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  slots: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => NextScene)
  next?: NextScene;
}
