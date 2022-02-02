---
title: 'Jovo Utility Types'
excerpt: 'Learn more about utility types used internally by Jovo products.'
---

# Utility Types

Learn more about content management system (CMS) services that can be integrated with Jovo.

## `PartialWhere`

Use this type to mark certain properties of your type as optional. This can be useful if you expect all values to be defined, but want to provide default values, if optional properties are omitted.

```typescript
interface Profile {
  name: string;
  email: string;
  token: string;
}

/**
 * This produces the type
 * {
 *   name: string;
 *   email: string;
 *   token?: string;
 * }
 */
type UserProfile = PartialWhere<Profile, 'token'>;

function createProfile(profile: UserProfile): Profile {
  // ...

  // If token is omitted, create a default one
  if(!profile.token) {
    profile.token = 'token';
  }  

  return profile;
}
```

## `RequiredOnlyWhere`

`RequiredOnlyWhere` works the exact opposite of `PartialWhere`, in that it marks the keys you provide as required, while all other properties are optional.

```typescript
interface Profile {
  name: string;
  email: string;
  token: string;
}

/**
 * This produces the type
 * {
 *   name: string;
 *   email: string;
 *   token?: string;
 * }
 */
type UserProfile = RequiredOnlyWhere<Profile, 'name' | 'email'>;

function createProfile(profile: UserProfile): Profile {
  // ...

  // If token is omitted, create a default one
  if(!profile.token) {
    profile.token = 'token';
  }  

  return profile;
}
```


