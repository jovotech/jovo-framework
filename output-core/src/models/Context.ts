import {
  IsNotEmpty,
  IsOptional,
  IsString,
  TransformMap,
  Type,
  ValidateNested,
} from '@jovotech/output';

export class Intent {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class Input {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  key?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  value?: unknown;
}

export class RequestContextAsr {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}

// TODO: determine whether they're called inputs or entities
export class RequestContextNlu {
  @IsOptional()
  @ValidateNested()
  @Type(() => Intent)
  intent?: Intent;

  @IsOptional()
  @ValidateNested({ each: true })
  @TransformMap(() => Input)
  inputs?: Record<string, Input>;
}

export class RequestContext {
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestContextAsr)
  asr?: RequestContextAsr;

  @IsOptional()
  @ValidateNested()
  @Type(() => RequestContextNlu)
  nlu?: RequestContextNlu;
}

export class Context {
  @ValidateNested()
  @Type(() => RequestContext)
  request: RequestContext;
}
