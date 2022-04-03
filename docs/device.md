---
title: 'Device'
excerpt: 'Lear more about the Jovo Device class that allows you to retrieve device-specific features and capabilities.'
---

# Device

The Jovo `$device` class allows you to retrieve device-specific features and capabilities.

## Introduction

Many Jovo apps work across different devices. Some devices might offer only audio output, others come with a screen. Some devices may even have specific information like an address.

The Jovo `$device` class groups everything you need to know about a device together. You can access it like like this:

```typescript
this.$device;
```

The most relevant features of `$device` are [capabilities](#capabilities) and [platform-specific features](#platform-specific-device-features).

## Capabilities

You can access a device's capabilities like this:

```typescript
this.$device.capabilities;

// Example result: [ 'SCREEN', 'AUDIO' ] or [Capability.Screen, Capability.Audio]
```

You can also use the `supports` method to check if the device supports specific capabilities. It expects the `Capability` enum or the string value.

```typescript
import { Capability } from '@jovotech/framework';

this.$device.supports(capability: Capability)

// Example for one capability
if (this.$device.supports(Capability.Screen)) {}
// or
if (this.$device.supports('SCREEN')) {}

// Example for multiple capabilities
if (this.$device.supports(Capability.Screen) && this.$device.supports(Capability.Video)) {}
// or
if (this.$device.supports('SCREEN') && this.$device.supports('VIDEO')) {}
```

The following capabilities are currently available in the generic `$device` class:

- `AUDIO` or `Capability.Audio`: It's possible to play audio output via SSML.
- `LONGFORM_AUDIO` or `Capability.LongformAudio`: It's possible to play long-form audio output, e.g. Alexa AudioPlayer or Google Assistant Media Response.
- `SCREEN` or `Capability.Screen`: It's possible to show visual output on a screen.
- `VIDEO` or `Capability.Video`: It's possible to play a video on a screen.

## Platform-Specific Device Features

Some platforms like Alexa offer specific capabilities like APL. You can access them by prepending the platform name like this:

```typescript
import { AlexaCapability } from '@jovotech/platform-alexa';
import { GoogleAssistantCapability } from '@jovotech/platform-googleassistant';

this.$device.supports(AlexaCapability.Apl);
// or
this.$device.supports('ALEXA:APL');

this.$device.supports(GoogleAssistantCapability.InteractiveCanvas);
// or
this.$device.supports('INTERACTIVE_CANVAS');
```

If a platform offers specific device features beyond capabilities, you can access its `$device` object as part of the platform object. Here is an example for Amazon Alexa:

```typescript
this.$alexa.$device;
```

## Under the Hood

The `JovoDevice` class is abstract and has to be implemented by every platform with a few generic and a couple of specific functions. The platform fills the `capabilities` array on initiation by calling the `getDeviceCapabilities()`-method of the platform-specific request-class.
