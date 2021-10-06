# Migration

Learn how to migrate to Jovo `v4` from a `v3` project.

- [Introduction](#introduction)
- [Packages](#packages)
- [New Concepts](#new-concepts)
  - [Components](#components)
  - [Handlers](#handlers)
  - [Output](#output)
- [CLI](#cli)
- [App Configuration](#app-configuration)
- [Naming](#naming)
- [Models](#models)
- [Integrations](#integrations)
  - [Databases](#databases)

## Introduction


## Packages

```sh
# v3
$ npm install -g jovo-cli

# v4
$ npm install -g @jovotech/cli
```


```typescript
// v3
import { Alexa } from `jovo-platform-alexa`;

// v4
import { AlexaPlatform } from `@jovotech/platform-alexa`;
```



## New Concepts

### Components


### Handlers


### Output


## CLI

```sh
# v3
$ npm install -g jovo-cli

# v4
$ npm install -g @jovotech/cli
```

## App Configuration

```typescript
// v3
app.use(new Alexa())

// v4
const app = new App({
  plugins: [
    new AlexaPlatform(),
  ]
})
```

## Naming

```typescript
// v3
this.$alexaSkill

// v4
this.$alexa
```

## Models

* `inputs` are now called `entities`
* `inputTypes` are now called `entityTypes`
* `intents`, `entities`, and `entityTypes` are now maps instead of arrays

```json
// v3
{
  "invocation": "my test app",
  "intents": [
    {
      "name": "YesIntent",
      "phrases": [
        "yes",
        "yes please",
        "sure"
      ]
    },
    {
      "name": "NoIntent",
      "phrases": [
        "no",
        "no thanks"
      ]
    }
  ]
}

// v4
{
  "invocation": "my test app",
  "intents": {
    "YesIntent": {
      "phrases": [
        "yes",
        "yes please",
        "sure"
      ]
    },
    "NoIntent": {
      "phrases": [
        "no",
        "no thanks"
      ]
    }
  }
}
```

## Integrations

### Databases

* `lastUsedAt` changed to `updatedAt`