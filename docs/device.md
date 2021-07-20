# Device

The Jovo `$device` class allows you to retrieve device-specific features and capabilities.

- [Introduction](#introduction)
- [Capabilities](#capabilities)
- [Platform-Specific Device Features](#platform-specific-device-features)
- [Under the Hood](#under-the-hood)

## Introduction

Many Jovo apps work across different devices. Some devices might offer only audio output, others come with a screen. Some devices may even have specific information like an address.

The Jovo `$device` class groups everything you need to know about a device together. You can access it like like this:

```typescript
this.$device
```

The most relevant features of `$device` are [capabilities](#capabilities) and [platform-specific features](#platform-specific-device-features).


## Capabilities

You can access a device's capabilities like this:

```typescript
this.$device.capabilities

// Example result: [ 'screen', 'audio' ]
```

You can also use the `supports` method to check if the device supports specific capabilities. It returns `true` if one of the passed capabilities is supported (`OR` for multiple capabilities):

```typescript
this.$device.supports(capability: Capability[] | Capability)

// Example for one capability
this.$device.supports('screen')

// Example for multiple capabilities
this.$device.supports(['screen', 'video'])
```

The following capabilities are currently available in the generic `$device` class:

* `audio`: It's possible to play audio output via SSML.
* `long-form-audio`: It's possible to play long-form audio output, e.g. Alexa AudioPlayer or Google Assistant Media Response.
* `screen`: It's possible to show visual output on a screen.
* `video`: It's possible to play a video on a screen.



## Platform-Specific Device Features

Some platforms like Alexa offer specific capabilities like APL. You can access them by prepending the platform name like this:

```typescript
this.$device.supports('alexa:apl')
```

If a platform offers specific device features beyond capabilities, you can access its `$device` object as part of the platform object. Here is an example for Amazon Alexa:

```typescript
this.$alexa.$device
```




## Under the Hood

The `JovoDevice` class is abstract and has to be implemented by every platform with a few generic and a couple of specific functions. The platform fills the `capabilities` array on initiation.

Here is an example for Alexa:

```typescript
private applyDataFromRequest(): void {
  const supportedInterfaces = this.jovo.$request.context?.System?.device?.supportedInterfaces;

  if (supportedInterfaces?.AudioPlayer) {
    this.addCapability('audio', 'long-form-audio');
  }

  if (supportedInterfaces?.['Alexa.Presentation.APL']) {
    this.addCapability('screen', 'alexa:apl');
  }

  // ...
}
```

