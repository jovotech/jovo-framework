import { Equals, IsObject, IsOptional, IsString, IsUrl } from '@jovotech/output';

export class HtmlRequest {
  @IsUrl()
  uri!: string;

  @Equals('GET')
  method!: 'GET';

  @IsOptional()
  @IsObject()
  @IsString({ each: true })
  headers?: Record<string, string>;
}
