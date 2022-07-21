import { EnumLike } from '@jovotech/framework';

export enum ConsentLevel {
  Account = 'ACCOUNT',
  Person = 'PERSON',
}

export type ConsentLevelLike = EnumLike<ConsentLevel> | string;
