import {
  Equals,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOfEitherType,
  IsOptional,
  IsString,
  TransformMap,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { AplLayout } from '../apl/AplLayout';
import { AplResource } from '../apl/AplResource';
import { ApltDocumentSettings } from './ApltDocumentSettings';

export class ApltDocument {
  @Equals('APLT')
  type!: 'APLT';

  @Equals('1.0')
  version!: '1.0';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => AplLayout)
  layouts?: Record<string, AplLayout>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AplResource)
  resources?: AplResource[];

  @IsObject()
  @IsOfEitherType(['array', 'object'], { each: true })
  mainTemplate!: { item: Record<string, unknown> } | { items: Record<string, unknown>[] };

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  onMount?: Record<string, unknown>[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ApltDocumentSettings)
  settings?: ApltDocumentSettings;
}
