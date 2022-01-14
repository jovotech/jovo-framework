---
title: 'Utility types'
excerpt: 'Learn more about the different utility types.'
---

# Utility types

Learn more about the TypeScript utility types used across Jovo repositories.

## Introduction

Jovo offers the ability to [create structured output](https://www.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://www.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into a Core response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

You can also add platform-specific output to an output template. [Learn more about Core-specific output below](#core-specific-output-elements).

```typescript
{
  // ...
  platforms: {
    core: {
      // ...
    }
  }
}
```

## AnyObject

Use this type if you want to construct an object that accepts values with any type, (e.g. `string`, `boolean`, ...):

```typescript
import { AnyObject } from '@jovotech/common';

const profile: AnyObject = {
  name: 'Max',
  firstTime: true,
  address: {
    city: 'Berlin',
  },
};
```

## UnknownObject

`UnknownObject` behaves similar to `AnyObject`, in that it accepts any type as values, however when accessing values you need to cast them to the desired type:

```typescript
import { UnknownObject } from '@jovotech/common';

function greetUser(name: string): void {
  console.log(`Hello ${name}!`);
}

const profile: UnknownObject = {
  name: 'Max',
  firstTime: true,
  address: {
    city: 'Berlin',
  },
};

greetUser(profile.name as string);
```

## ArrayElement

This type extracts the type of the provided array:

```typescript
import { ArrayElement } from '@jovotech/common';

type StringArray = string[];

function getFirst<ARRAY extends unknown[]>(arr: ARRAY): ArrayElement<ARRAY> {
  return arr.shift();
}
```

## Constructor

Use `Constructor` to define a constructor function with the provided types:

```typescript

```

## PickWhere

Use this type to construct an object that consists of a filtered set of types of another object:

```typescript
export interface Profile {
  name: string;
  email: string;
  address: {
    city: string;
    street: string;
  };
}

export type OnlineProfile = PickWhere<Profile, 'name' | 'email'>;

const user: OnlineProfile = {
  name: 'Max',
  email: 'max@mail.com',
};
```

## OmitWhere

`OmitWhere` works the opposite of `PickWhere`, as it omits the types rather than picking them:

```typescript

```

## FilterKey

Use this type if you want to filter out types that do not equal each other:

```typescript

```

## OmitIndex

In TypeScript, you can define your interface with an [index signature](https://www.typescriptlang.org/docs/handbook/interfaces.html#indexable-types) to assign a fixed type to your keys. To remove this index signature, you can use `OmitIndex`:

```typescript
export interface Profile {
  [key: string]: string | object;
  name: string;
  email: string;
  address: {
    city: string;
    street: string;
  };
}

const user: Profile = {
  /* ... */
};
// Since an index signature is defined, you can assign new values to the object,
// as long as the key is of type string and the value is of type string or object
user.sex = 'male';

const strictUser: OmitIndex<Profile> = {
  /* ... */
};
// Since strictUser does not have an explicit index signature anymore,
// you can't add new values to the object
strictUser.sex = 'male'; // Throws an error
```

This is useful for when you want to restrict an object to it's set of key-value-pairs, or want to perform further operations on your type without taking the index signature into account.

## IndexSignature

While you can use `OmitIndex` to remove the index signature of your type, you can get the index signature type by using `IndexSignature`:

```typescript
export interface Profile {
  [key: string]: string | object;
  name: string;
  email: string;
  address: {
    city: string;
    street: string;
  };
}

type Signature = IndexSignature<Profile>;
```

## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo Output docs](https://www.jovo.tech/docs/output-templates).

The Core Platform supports exactly the same output elements as they appear in the generic output.

## Core-specific Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output documentation](https://www.jovo.tech/docs/output-templates#platform-specific-output-elements).

For Core, you can add output elements inside an `core` object:

```typescript
{
  // ...
  platforms: {
    core: {
      // ...
    }
  }
}
```

### Native Response

The [`nativeResponse` property](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md#native-response) allows you to add native elements exactly how they would be added to the Core JSON response.

```typescript
{
  // ...
  platforms: {
    core: {
      nativeResponse: {
        // ...
      }
    }
  }
}
```
