import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  IsString,
  Type,
  ArrayMinSize,
} from '@jovotech/output';
import { EntitySynonymsContainValue } from '../decorators/validation/EntitySynonymsContainValue';

export enum EntityOverrideMode {
  Unspecified = 'ENTITY_OVERRIDE_MODE_UNSPECIFIED',
  Override = 'ENTITY_OVERRIDE_MODE_OVERRIDE',
  Supplement = 'ENTITY_OVERRIDE_MODE_SUPPLEMENT',
}

export class SessionEntityType {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EntityOverrideMode)
  entity_override_mode: EntityOverrideMode;

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
