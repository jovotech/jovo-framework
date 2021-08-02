import {
  EnumLike,
  formatValidationErrors,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsSomeValid,
  IsString,
  isString,
  Type,
  validate,
  ValidateNested,
} from '@jovotech/output';
import { RbmSuggestion } from './RbmSuggestion';

export class RbmCardContent {
  @IsSomeValid<RbmCardContent>({
    keys: ['title', 'description', 'media'],
    validate: (value, args) => {
      if (!isString(value)) {
        return '$property must be a string';
      }
      if (!value) {
        return '$property should not be empty';
      }
      return;
    },
  })
  title?: string;

  @IsSomeValid<RbmCardContent>({
    keys: ['title', 'description', 'media'],
    validate: (value, args) => {
      if (!isString(value)) {
        return '$property must be a string';
      }
      if (!value) {
        return '$property should not be empty';
      }
      return;
    },
  })
  description?: string;

  @IsSomeValid<RbmCardContent>({
    keys: ['title', 'description', 'media'],
    validate: async (value, args) => {
      if (!(value instanceof RbmMedia)) {
        return `$property has to be an instance of RbmMedia`;
      }

      const errors = await validate(value);
      if (errors.length) {
        return formatValidationErrors(errors, {
          text: '$property is invalid:',
          delimiter: '\n  - ',
          path: '$property',
        });
      }
      return;
    },
  })
  @Type(() => RbmMedia)
  media?: RbmMedia;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RbmSuggestion)
  suggestions?: RbmSuggestion[];
}

export enum Height {
  Unspecified = 'HEIGHT_UNSPECIFIED',
  Short = 'SHORT',
  Medium = 'MEDIUM',
  Tall = 'TALL',
}

export type HeightLike = EnumLike<Height>;

export class RbmMedia {
  @IsString()
  @IsNotEmpty()
  file_uri: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  thumbnail_uri?: string;

  @IsOptional()
  @IsEnum(Height)
  height?: HeightLike;
}
