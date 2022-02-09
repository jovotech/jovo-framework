---
title: 'Output Template'
excerpt: 'Learn more about the structure of Jovo output templates, which offer the ability to create cross-platform output for voice and chat experiences.'
---

# Output Templates

Learn more about the structure of Jovo output templates, which offer the ability to create cross-platform output for voice and chat experiences.

## Introduction

The Jovo output template engine takes structured output and translates it into a native platform response. This makes it possible to have a common format for multimodal output that works across platforms and devices.

For example, here is a simple output that just returns a "Hello World!":

```typescript
{
  message: 'Hello World!',
}
```

And here is an example that asks the user a question and offers guidance how to answer:

```typescript
{
  message: 'Do you like pizza?',
  quickReplies: [ 'yes', 'no' ],
}
```

Jovo output offers both [generic output](#generic-output-elements) as well as [platform-specific output elements](#platform-specific-output-elements).

## Generic Output Elements

Jovo output templates come with a selection of generic elements that are supported by most platforms, including:

- [`message`](#message)
- [`reprompt`](#reprompt)
- [`carousel`](#carousel)
- [`card`](#card)
- [`richAudio`](#richAudio)
- [`quickReplies`](#quickreplies)
- [`listen`](#listen)

Not all platforms support all of these elements. In such a case, the platform just ignores that element and still successfully builds the rest of the output template.

### message

The `message` is usually either what you hear (speech output) or what see you see in the form of a chat bubble.

```typescript
{
  message: 'Hello world!',
}
```

A `message` can either be a `string` or have the following properties:

```typescript
{
  message: {
    speech: 'Hello listener!', // For voice platforms
    text: 'Hello reader!', // For chat platforms and voice platforms that support display text
  }
}
```

`message` also supports randomization. If you use an array, one of the elements will be picked randomly. This works for both strings as well as the object structure shown above.

```typescript
{
  message: [
    'Hi!',
    'Hello!',
    { speech: 'Hello listener.', text: 'Hello reader.'
  ],
}
```

### reprompt

The `reprompt` is typically only relevant for voice interfaces. It represents the output that is presented to the user if they haven't responded to a previous question.

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
}
```

A `reprompt` can have the same values (`speech`, `text`) as a [`message`](#message) and also supports randomization if you use an array.

```typescript
{
  reprompt: [
    'Could you tell me your name?',
    'I missed your name, could you please repeat it?',
  ],
}
```

### card

Cards are often used to display content in a visual and structured way.

```typescript
{
  card: {
    title: 'Hello world!',
    content: 'Welcome to this new app built with Jovo.',
  },
}
```

A `card` consists of the following properties:

- `title`: required
- `key`
- `subtitle`
- `content`
- `imageUrl`
- `imageAlt`

### carousel

A carousel is a (usually horizontally scrollable) collection of at least 2 [cards](#card).

```typescript
{
  carousel: {
    items: [
      {
        title: 'Element 1',
        content: 'To my right, you will see element 2.'
      },
      {
        title: 'Element 2',
        content: 'Hi there!'
      },
    ],
  },
}
```

A `carousel` consists of the following properties:

- `title`
- `items`: An array of [card](#card) items

### richAudio

Rich Audio combines audio files, text-to-speech and silence to provide more flexibility than simple responses.

Supported components:

 - Sequencer - plays its `items` in sequence
 - Mixer - plays its `items` in parallel
 - Audio - plays the `source` audio file
 - Speech - says the `content` using regular TTS
 - Silence - plays nothing for `duration` milliseconds

Check out the [Alexa APLA Docs](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-for-audio-reference.html) for more detail on the allowed components.

```typescript
{
  richAudio: {
    type: 'Sequencer',
    items: [
      {
        type: "Speech",
        content: "Text content"
      },
      {
        type: "Audio",
        source: "https://assets.com/intro_sound.mp3"
      }
    ]
  }
}
```

On the `googleAssistant` platform, this object will be converted into [non-standard Google SSML](https://cloud.google.com/text-to-speech/docs/ssml) (ie. using `seq` and `par` tags).

If used in the same response, `richAudio` outputs will be combined with `message` outputs by including
the message as `Speech` elements in a top-level `Sequencer` element. This means that complex logic with
multiple calls to `$send` doesn't need to be modified to include sound effects and audio clips.

For example, this:

```ts
await this.$send({
  richAudio: {
    type: "Audio",
    source: "https://assets.com/intro_sound.mp3"
  }
});

await this.$send({  message: "Welcome to my app." });
await this.$send({  message: `Your name is ${name}.` });

await this.$send({
  richAudio: {
    type: "Audio",
    source: "https://assets.com/sound_effect.mp3"
  }
});
```

is equivalent to this:

```ts
await this.$send({
  richAudio: {
    type: "Sequencer",
    items: [
      {
        type: "Audio",
        source: "https://assets.com/intro_sound.mp3"
      },
      {
        type: "Speech",
        content: "Welcome to my app."
      },
      {
        type: "Speech",
        content: `Your name is ${name}.`
      },
      {
        type: "Audio",
        source: "https://assets.com/sound_effect.mp3"
      },
    ],
  }
});
```

### quickReplies

Quick replies (sometimes called _suggestion chips_) are little buttons that provide suggestions for the user to tap instead of having to type out a response to a question.

```typescript
{
  quickReplies: [
    'Berlin',
    'NYC',
  ],
}
```

Quick replies can also contain a `text` and a `value`:

```typescript
{
  quickReplies: [
    {
      text: 'Berlin',
      value: 'berlin',
    },
    // ...
  ],
}
```

Usually, the `value` of the quick reply gets passed to a platform's natural language understanding service. For some platforms, you can also add intent (and entity) information so that the button click can be directly mapped to structured user input:

```typescript
{
  quickReplies: [
    {
      text: 'Berlin',
      intent: 'CityIntent',
      entities: {
        city: {
          value: 'berlin',
        },
      },
    },
    // ...
  ],
}
```

### listen

Especially for voice platforms, it is important to indicate whether you are expecting the user to answer (keep the microphone open) or want the session to close. The `listen` property is used for this. By default, it is set to `true`, even if you don't specify it in your output template.

If you want the session to close, you need to set it to `false`:

```typescript
{
  message: `Goodbye!`,
  listen: false,
}
```

It's also possible to turn `listen` into an object to tell the platform to listen for specific user input. You can add dynamic entities this way:

```typescript
{
  // ...
  listen: {
    entities: {
      CityType: {
        values: [
          {
            value: 'berlin',
          },
          // ...
        ],
      },
    },
  },
}
```

[Learn more about dynamic entities in the entities documentation](./entities.md).

In the case that your output is an [array of objects](#array-of-output-templates) with differing `listen` values, the one of the last array will be prioritized. The only exception is that a `listen: true` value does not override dynamic entities, because setting dynamic entities implicitly sets `listen` to `true`. A last item in an array with `listen: false` closes the session and removes previous dynamic entities.

## Platform Specific Output Elements

Each output object can contain a `platforms` element for platform specific content:

```typescript
{
  message: 'Hello world!',
  platforms: {
    // ...
  },
}
```

You can reference each platform by using their name, for example `alexa` or `googleAssistant`:

```typescript
{
  message: 'Hello world!',
  platforms: {
    alexa: {
      // ...
    },
  },
}
```

There are two ways how this can be used:

- Add content types that are only available on one platform (for example an account linking card on Alexa)
- Override [generic output elements](#generic-output-elements) for specific platforms

For example, the `message` can be overridden for Alexa users:

```typescript
{
  message: 'Hello world!',
  platforms: {
    alexa: {
      message: 'Hello Alexa!',
    },
  },
}
```

A platform can also remove generic output by setting it to `null`:

```typescript
{
  message: 'Hello world!',
  platforms: {
    alexa: {
      message: null,
    },
  },
}
```

### Native Response

For each platform, you can add a `nativeResponse` object that is directly translated into the native platform JSON.

```typescript
{
  message: 'Hello world!',
  platforms: {
    alexa: {
      nativeResponse: {
        // Add elements in the same way they show up in the response JSON
      },
    },
  },
}
```

If you want to explicitly remove a property, you can set it to `undefined`. In the following example, the `shouldEndSession` property is removed from the Alexa response:

```typescript
{
  message: 'Hello world!',
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: undefined,
        },
      },
    },
  },
}
```

## Array of Output Templates

You can also have an array of output objects:

```typescript
[
  {
    message: 'Hello world!',
  },
  {
    message: 'This is a second chat bubble.',
  },
];
```

Platforms that support multiple responses will display the example above in 2 chat bubbles. Synchronous platforms like Alexa will concatenate the `message` to a single response:

```typescript
{
  message: 'Hello world! This is a second chat bubble.',
}
```

If the [`message`](#message) is an object for one of the output objects, the other `message` strings are treated as if the spoken `speech` and `text` are the same. Here is an example:

```typescript
// Before merging
[
  {
    message: 'Hello world!',
  },
  {
    message: {
      speech: 'This is spoken text.',
      text: 'This is display text.',
    },
  },
]

// After merging
{
  message: {
    speech: 'Hello world! This is spoken text.',
    text: 'Hello world! This is display text.',
  },
}
```

For elements that are only allowed once per response (like [`card`](#card) or [`carousel`](#carousel)), the last object of the array will be prioritized, overriding previous elements.
