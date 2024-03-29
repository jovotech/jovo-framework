import {
  ArrayMaxSize,
  formatValidationErrors,
  IsArray,
  IsBoolean,
  IsEitherValid,
  IsNotEmpty,
  isObject,
  IsOptional,
  isString,
  IsString,
  JovoResponse,
  Type,
  validate,
  ValidateNested,
} from '@jovotech/output';
import { Image, Representative, RichCard, Suggestion, SUGGESTIONS_MAX_SIZE } from './output';

export class GoogleBusinessResponse extends JovoResponse {
  [key: string]: unknown;

  @IsString()
  messageId!: string;

  @ValidateNested()
  @Type(() => Representative)
  representative!: Representative;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUGGESTIONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => Suggestion)
  suggestions?: Suggestion[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fallback?: string;

  @IsOptional()
  @IsBoolean()
  containsRichText?: boolean;

  // union
  @IsEitherValid<GoogleBusinessResponse>({
    name: 'isValidGoogleBusinessResponseContent',
    keys: ['text', 'image', 'richCard'],
    validate: async (value) => {
      if (!isString(value)) {
        return '$property must be a string';
      }
      if (!value) {
        return '$property should not be empty';
      }
      return;
    },
  })
  text?: string;

  @IsEitherValid<GoogleBusinessResponse>({
    name: 'isValidGoogleBusinessResponseContent',
    keys: ['text', 'image', 'richCard'],
    validate: async (value) => {
      if (!isObject(value)) {
        return '$property must be an object.';
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
  @Type(() => Image)
  image?: Image;

  @IsEitherValid<GoogleBusinessResponse>({
    name: 'isValidGoogleBusinessResponseContent',
    keys: ['text', 'image', 'richCard'],
    validate: async (value) => {
      if (!isObject(value)) {
        return '$property must be an object.';
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
  @Type(() => RichCard)
  richCard?: RichCard;

  hasSessionEnded(): boolean {
    return false;
  }
}
