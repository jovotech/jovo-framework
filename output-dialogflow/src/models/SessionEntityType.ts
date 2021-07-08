import {
  ArrayMinSize,
  EnumLike,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { EntitySynonymsContainValue } from '../decorators/validation/EntitySynonymsContainValue';

export enum EntityOverrideMode {
  Unspecified = 'ENTITY_OVERRIDE_MODE_UNSPECIFIED',
  Override = 'ENTITY_OVERRIDE_MODE_OVERRIDE',
  Supplement = 'ENTITY_OVERRIDE_MODE_SUPPLEMENT',
}

export type EntityOverrideModeLike = EnumLike<EntityOverrideMode>;

export class SessionEntityType {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EntityOverrideMode)
  entity_override_mode: EntityOverrideModeLike;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Entity)
  entities: Entity[];
}

export class Entity {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @EntitySynonymsContainValue()
  synonyms: string[];
}
