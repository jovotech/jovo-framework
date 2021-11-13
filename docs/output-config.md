---
title: 'Output Configuration'
excerpt: 'There are certain configurations that determine how an output template is translated into a native platform response.'
---

# Output Configuration

Learn how to configure the Jovo output template converter.

## Introduction

There are certain configurations that determine how an output template is translated into a native platform response.

You can add output configuration to the [Jovo app configuration](./app-config.md). For example, this is how [generic output config properties](#generic-output-config-properties) can be added to `app.ts`:

```typescript
const app = new App({
  // ...

  output: {
    // Generic output config
  },
});
```

Some platforms also support [platform-specific output config properties](#platform-specific-config-properties) that can be added to a platform plugin:

```typescript
const app = new App({
  // ...

  plugins: [
    new AlexaPlatform({
      output: {
        // Alexa output config
      },
    }),
  ],
});
```

## Generic Output Config Properties

This is the default output configuration:

```typescript
const app = new App({
  // ...

  output: {
    omitWarnings: false,
    validation: true,
    sanitization: true,
  },
});
```

It includes the following properties:

- `omitWarnings`: If `true`, it does not log warnings if an output element gets sanitized.
- `validation`: If `true`, output properties are validated before and after the conversion. [Learn more below](#validation).
- `sanitization`: If `true`, output properties that exceed their limit get automatically sanitized. [Learn more below](#sanitization).

### Validation

The output converter validates both the output (`before`) and the native platform response (`after`) to see if they have the right structure.

```typescript
{
  validation: {
    before: true,
    after: true,
  },
}

// Short
{
  validation: true,
}
```

Here are some examples of what is validated:

- Does the property have the right type? For example, a `title` should be a `string`.
- Are all required properties available? For example, does a card contain a `title`?
- Do none of the properties exceed the maximum size? For example, does a card's `title` not exceed the number of allowed characters?

### Sanitization

As mentioned in the [validation](#validation) section, it might happen that an element may exceed its limits, for example a `title` having too many characters, or a `carousel` having too many `items`.

The Jovo output template converter can automatically trim elements that exceed their maximum size.

```typescript
{
  sanitization: {
    trimArrays: true,
    trimStrings: true,
    trimMaps: true,
  },
}

// Short
{
  sanitization: true,
}
```

For arrays, the overflowing items get removed. Strings get truncated to fit the right amount of characters.

If sanitization happens, a warning is logged. This can be omitted with the [`omitWarnings` config](#generic-output-config-properties) referenced in the section above.

## Platform-specific Config Properties

It's also possible to add platform-specific output configurations. Here is an example for Alexa:

```typescript
const app = new App({
  // ...

  plugins: [
    new AlexaPlatform({
      output: {
        // Alexa output config
      },
    }),
  ],
});
```

You can find platform-specific output configuration properties in the respective platform output documentation, which you can find in the [Jovo Marketplace](https://www.jovo.tech/marketplace/).
