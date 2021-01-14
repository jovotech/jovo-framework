import { HandlerMetadata } from './HandlerMetadata';

// TODO: implement
export class HandlerMetadataStorage {
  private static instance: HandlerMetadataStorage;
  readonly metadata: HandlerMetadata[];

  private constructor() {
    this.metadata = [];
  }

  static getInstance(): HandlerMetadataStorage {
    if (!HandlerMetadataStorage.instance) {
      HandlerMetadataStorage.instance = new HandlerMetadataStorage();
    }
    return HandlerMetadataStorage.instance;
  }
}
