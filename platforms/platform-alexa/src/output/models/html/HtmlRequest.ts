import { Equals, IsDataURI, IsObject, IsOptional, IsString } from '@jovotech/output';

export class HtmlRequest {
  @IsDataURI()
  uri!: string;

  @Equals('GET')
  methods!: 'GET';

  @IsOptional()
  @IsObject()
  @IsString({ each: true })
  headers?: Record<string, string>;
}
