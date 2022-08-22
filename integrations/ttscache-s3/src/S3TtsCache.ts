import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  S3ClientConfig
} from '@aws-sdk/client-s3';

import { Readable } from 'stream';

import { urlJoin } from 'url-join-ts';

import { TtsCachePlugin, TtsCachePluginConfig, TtsData, AudioUtilities, RequiredOnlyWhere } from '@jovotech/framework';

export interface S3TtsCacheConfig extends TtsCachePluginConfig {
  bucket: string;
  path: string;
  libraryConfig?: S3ClientConfig;
}

export type S3TtsCacheInitConfig = RequiredOnlyWhere<S3TtsCacheConfig, 'bucket' | 'path'>;

export class S3TtsCache extends TtsCachePlugin<S3TtsCacheConfig> {
  readonly client: S3Client;

  constructor(config: S3TtsCacheInitConfig) {
    super(config);

    this.client = new S3Client({
      ...this.config.libraryConfig
    });
  }

  get baseUrl(): string {
    return `https://${this.config.bucket}.s3.amazonaws.com`;
  }

  getInitConfig(): S3TtsCacheInitConfig {
    return {
      bucket: '<YOUR-BUCKET-NAME>',
      path: '<YOUR-PATH>',
    }
  }

  getDefaultConfig(): S3TtsCacheConfig {
    return {
      bucket: '<YOUR-BUCKET-NAME>',
      path: '<YOUR-PATH>',
      returnEncodedAudio: false,
    };
  }

  async getItem(key: string, locale: string, fileExtension: string): Promise<TtsData | undefined> {
    let command: HeadObjectCommand | GetObjectCommand;
    const filePath = this.getFilePath(key, locale, fileExtension);
    const fullPath = urlJoin(this.baseUrl, filePath);

    if (this.config.returnEncodedAudio) {
      command = this.buildGetCommand(filePath);
    } else {
      command = this.buildHeadCommand(filePath);
    }

    try {
      const response = await this.client.send(command);

      const body = (response as GetObjectCommandOutput).Body;
      if (body) {
        const result: TtsData = {
          key,
          fileExtension,
          contentType: response.ContentType,
          url: fullPath,
          encodedAudio: await AudioUtilities.getBase64Audio(body as Readable),
        };

        return result;
      }

      if (response.ContentType) {
        return {
          key,
          fileExtension,
          contentType: response.ContentType,
          url: fullPath,
        };
      }
    } catch (error) {
      console.log((error as Error).message);
    }

    // object couldn't be retrieved from cache
    return;
  }

  private buildHeadCommand(filePath: string) {
    const params: HeadObjectCommandInput = {
      Bucket: this.config.bucket,
      Key: filePath,
    };

    const command = new HeadObjectCommand(params);
    return command;
  }

  private buildGetCommand(filePath: string) {
    const params: GetObjectCommandInput = {
      Bucket: this.config.bucket,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    return command;
  }

  async storeItem(key: string, locale: string, data: TtsData): Promise<string | undefined> {
    if (!data.encodedAudio) {
      return;
    }

    const filePath = this.getFilePath(key, locale, data.fileExtension);
    const fullPath = urlJoin(this.baseUrl, filePath);
    const body = Buffer.from(data.encodedAudio, 'base64');

    const params: PutObjectCommandInput = {
      Bucket: this.config.bucket,
      Key: filePath,
      Body: body,
      ContentType: data.contentType,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);

    try {
      await this.client.send(command);
      return fullPath;
    } catch (error) {
      console.log((error as Error).message);
    }

    return;
  }

  private getFilePath(key: string, locale: string, extension?: string) {
    const filename = extension ? `${key}.${extension}` : key;
    const filePath = urlJoin(this.config.path, locale, filename);
    return filePath;
  }
}
