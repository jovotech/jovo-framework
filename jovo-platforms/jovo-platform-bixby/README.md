# Samsung Bixby Platform Integration

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-bixby

Learn more about how Bixby works and how you can use it with the Jovo Framework.

- [Introduction](#introduction)
- [Bixby Basics](#bixby-basics)
  - [Models](#models)
    - [Primitives](#primitives)
    - [Structures](#structures)
    - [Actions](#actions)
  - [Dialog and Views](#dialog-and-views)
  - [Training](#training)
  - [Configuration](#configuration)
    - [Capsule Properties and Endpoints](#capsule-properties-and-endpoints)
    - [Deployment Configuration](#deployment-configuration)
- [Jovo Models](#jovo-models)
  - [Jovo Primitives](#jovo-primitives)
  - [Jovo Structures](#jovo-structures)
    - [JovoLayout](#jovolayout)
    - [JovoSessionData](#jovosessiondata)
    - [JovoResponse](#jovoresponse)
  - [Jovo Actions](#jovo-actions)
- [Bixby AudioPlayer](#bixby-audioplayer)
- [Bixby Layouts](#bixby-layouts)

## Introduction

With the launch of `v3.0` of the Jovo Framework, we introduced a new platform integration for Samsung Bixby. It enables you to program highly scalable cross-platform voice applications for Bixby and use the countless integrations for the Jovo Framework, such as persistent user storage and Content-Management-Systems.

You can access the `bixbyCapsule` object like this:

```javascript
// @language=javascript

this.$bixbyCapsule

// @language=typescript

this.$bixbyCapsule!
```

## Bixby Basics

Although Bixby has some similarities to other platforms such as Alexa or Google Assistant, it follows some majorly different development paradigms. While development for other platforms may be imperative driven, Bixby implements a declarative driven development process by allowing you to describe your intents with models, rather than pure code.

### Models

Models are the building blocks of a Bixby Capsule. They determine what and how Bixby can accomplish tasks, with desired inputs and outputs. When training your capsule, Bixby will take your models and builds an execution graph, which provides the exact order of operations for Bixby to take upon a specific user prompt.

Models can be split up into concepts and actions. A concept can be explained as an entity representing a "thing", such as a name, an animal, or something more complex like a restaurant order. There are many kinds of concepts, for very different use cases, the most common being [primitives](#primitives) and [structure concepts](#structures). Actions on the other hand act as an interface for an operation that Bixby can execute. With the help of concepts, they define a ruleset of inputs and outputs to achieve a desired result upon a user prompt.

#### Primitives

```bxb
text (NameInput) {
  description (A name to display in a welcome message.)
}
```

Primitives are the simplest building blocks of a Bixby Capsule and are able to hold data like text, numbers or boolean values. Primitives can be used to form [structures](#structures), inputs or outputs for [actions](#actions), for example.

> Read more about primitives [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/modeling.modeling-concepts#primitive-concepts).

#### Structures

```bxb
structure (JovoResponse) {
  description (Response from Jovo Framework.)

  property (_JOVO_SESSION_DATA_) {
    type (JovoSessionData)
    min (Optional)
    max (One)
  }

  property(_JOVO_AUDIO_) {
    type(audioPlayer.AudioInfo)
    min (Optional)
    max (One)
  }

  property(_JOVO_SPEECH_) {
    type(JovoSpeech)
    min (Optional)
    max (One)
  }

  property(_JOVO_TEXT_) {
    type(JovoText)
    min (Optional)
    max (One)
  }

  property (_JOVO_LAYOUT_) {
    type(JovoLayout)
    min (Optional)
    max (One)
  }
}
```

While primitives describe very simple data types, structures form more complex data sets, containing any number of properties. Each property is a concept by itself, with a specific set of attributes, describing their role and behaviour.

Each property is required to define it's type, optionality and cardinality. The type can be either a primitive or another structure, if you need to handle more complex data in nested structures. The keyword `min` defines the properties optionality, which can be either `Required` or `Optional`. `max` sets the properties cardinality, defining whether the property allows for more than one value. Valid values are `One` or `Many`. By default, each property has the attributes `min(Optional)` and `max(One)`.

If you want to enhance a structure, you can use the `extends` feature, which allows you to inherit the parent structure's properties and extend them by adding new properties.

```bxb
structure (MyOwnResponse) {
  description (This response extends the JovoResponse with an additional property.)

  extends (JovoResponse)

  property (MyOwnProperty) {
    type (MyOwnProperty)
    min (Optional)
    max (Many)
  }
}
```

If you want to assign a more specific role to your structure without altering any properties, you can use the `role-of` feature. This allows you to specialize a certain structure, so Bixby can distinguish between the same concept for different use cases.

```bxb
structure (MyOwnResponse) {
  description (This response is a specialization of the JovoResponse.)
  role-of (JovoResponse)
}
```

> Read more about structures [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/modeling.modeling-concepts#structure-concepts).

#### Actions

```bxb
action (MyNameIsAction) {
  description (Collects a name from the user and returns a welcome message.)
  type (Search)

  collect {
    input (_JOVO_INPUT_name) {
      type (NameInput)
      min (Required)
      max (One)
    }

    input (_JOVO_PREV_RESPONSE_) {
      type(JovoResponse)
      min (Required)
      max (One)
    }
  }
  output (JovoResponse)
}
```

Actions help Bixby understand how to act upon a specific user prompt and what to expect as inputs and outputs. For the platform integration, actions are intent-oriented, meaning that for every intent in your Jovo app, you have to define an action with corresponding inputs and outputs. As for structures, actions require a specific set of attributes, such as it's type, a number of inputs and an output type. The default action type is `Search`, but there are numerous more types available, each with it's own specific use case.

> Learn more about action types [here](https://bixbydevelopers.com/dev/docs/reference/type/action.type).

An action can only provide one output, which can be a primitive or a structure, depending on what your code will return. As for inputs, each one has to define a specific set of attributes, similar to structure properties. Attributes include a type, optionality and cardinality, but also optional input validation or default values.

> Read more about modeling actions [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/modeling.modeling-actions).

### Dialog and Views

Bixby provides two ways of communicating with the user: dialog and views. While dialog is used to play speech output to the user, to inform them about certain results or to request additional information, Views form your capsule's visual user interface, capable of showing text, buttons, input fields and lists, for example.

You can use the [SpeechBuilder](https://www.jovo.tech/docs/output/speechbuilder) to create rich responses, which will be returned to Bixby as a property of `JovoResponse`. If you want to use SSML, note that Bixby currently only supports the following SSML tags:

- `<lang>`
- `<audio>`

> Learn more about dialog in Bixby [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/refining-dialog.intro-dialog).

> Learn more about using SSML with Bixby [here](https://bixbydevelopers.com/dev/docs/reference/ref-topics/ssml).

> Learn more about the Jovo SpeechBuilder [here](https://www.jovo.tech/docs/output/speechbuilder).

Bixby allows you to build a visual experience with views, either for showing results, confirming certain operations or for requesting additional input.

> Learn more about views in Bixby [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/building-views.views).

> Learn more about using layouts [here](https://www.jovo.tech/marketplace/jovo-platform-bixby/layouts).

### Training

Training Bixby is similar to Alexa's interactive model. You provide a number of training samples, or utterances, which will be used by Bixby to understand your user's intents and how to differentiate between inputs. For that process, Bixby offers a training tool, which provides you with a visual interface for entering and specifying user utterances. Every utterance is required to specify a goal and optional inputs. A goal must be a model, either a concept or an action, depending on your use case. To reach that goal, you might need a number of inputs to satisfy the action or concept. To mark a part of your utterance as an input parameter, you need to specify it's type, so Bixby can associate it with required inputs specified in your goal.

![Training Example](./img/bixby-training.png 'This is how an example utterance in the training tool looks like.')

In this example training utterance, our goal will be `MyNameIsAction`, which requires an input primitive `NameInput` of type `text`.

> Learn more about training [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/training.intro-training).

The `training` file contains all of your capsule's natural language models, which are being used by Bixby to understand your user prompts and how to differentiate between inputs. For every training sample, a goal must be specified, telling Bixby what action to execute on that sample. Furthermore, you can specify inputs with associated nodes or even routes for Bixby to collect additional information.

### Configuration

Bixby offers multiple ways for setting certain configurations, either for the deployment process or properties for the capsule to work with while operating.

#### Capsule Properties and Endpoints

In your Bixby capsule, you're most likely to come across a `capsule.properties` file. This file acts similar to a `.env` file, as it stores configuration information, which could be changed without altering any models or code. For the platform integration, this file is required to contain your webhook url for communication between Bixby and the Jovo Framework.

As mentioned, Bixby uses your models to outline your capsule and to get an idea of what data to expect and how to handle it. To couple your models with your code logic, Bixby needs a way to know, which action model to associate with a certain part of your code. There are two ways to do this: local endpoints and remote endpoints. Per default, Bixby uses local endpoints in the form of javascript files, which export a single function executing your code and returning an output according to the associated model. Remote endpoints on the other hand allow you to outsource your code logic to a remote server and provide it's endpoint to Bixby, which, upon a user prompt, will send a post request to your server, where you can handle the action and return a valid response. The platform integration uses that feature to allow communication between the Jovo voice app and your capsule.

```bxb
endpoints {
  action-endpoints {
    action-endpoint (LaunchAction) {
      remote-endpoint ("{remote.url}") {
        method (POST)
      }
    }
    action-endpoint (MyNameIsAction) {
      remote-endpoint ("{remote.url}?intent=MyNameIsIntent") {
        method (POST)
      }
    }
  }
}
```

Note that we use the property `remote.url` as a prefix, which references the url we set in `capsule.properties`. Additionally, you have to specify which intent you want to trigger with your action by providing a query parameter `intent` in the endpoint's url. For your `LaunchAction`, you don't have to specify an intent.

> Read more about configuring endpoints [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.configuring-endpoints).

#### Deployment Configuration

Bixby provides multiple ways of adding configuration to your capsule, and depending on it's use case, it will be located in different files.

```bxb
capsule-info {
  display-name (Jovo Test Capsule)
  developer-name (Jovo)
  icon-asset (jovo-logo.png)
  description ("An example capsule, that demonstrates how to integrate a Bixby capsule into a Jovo Application.")
  website-url (https://jovo.tech)
  terms-url (https://jovo.tech/terms)
  search-keywords {
    keyword(jovo)
  }
  dispatch-name (Jovo Test Capsule)
}
```

`capsule-info.bxb` holds all of your capsule's information, such as it's display name, a description and certain search keywords.

> Learn more about `capsule-info.bxb` [here](https://bixbydevelopers.com/dev/docs/reference/type/capsule-info).

```bxb
hints {
  uncategorized {
    hint (start Jovo Test Capsule)
    hint (with Jovo Test Capsule)
    hint (ask Jovo Test Capsule)
  }
}
```

To be marketplace compliant, your capsule needs to provide hints in a `.hints.bxb` file. Hints are used by Bixby to provide your users with utterance suggestions, so they get an idea of how your capsule works and what they can achieve with it.

> Learn more about hints [here](https://bixbydevelopers.com/dev/docs/reference/type/hints).

```bxb
capsule {
  id (playground.jovo_test)
  version (0.1.0)
  format (3)
  targets {
    target (bixby-mobile-en-US)
  }
  runtime-version (3)
  capsule-imports {
    import (bixby.audioPlayer) {
     	version (1.1.4)
     	as (audioPlayer)
    }
  }
	permissions {
  	bixby-user-id-access
	}
	store-countries {
    all
  }
  store-sections {
    section (Utilities)
  }
}
```

Last, but not least, `capsule.bxb` acts as a place for deployment configuration for your capsule, such as it's version, library imports, runtime flags and deployment targets.

> Learn more about `capsule.bxb` [here](https://bixbydevelopers.com/dev/docs/reference/type/capsule).

## Jovo Models

When you start a new capsule with the intent of using the platform integration with the Jovo Framework, it is recommended to start with our Bixby Hello World Template. Not only does it come with our [Hello World Example](https://www.jovo.tech/templates/helloworld), it also includes all Jovo models required for the integration to work properly. You can download it using the following command:

```sh
$ jovo3 new bixby-hello-world --template bixby
```

Usually, all models have their respective folders, such as `actions/` for actions, `primitives/` for primitives and so on. However, in our example capsule, located inside `platforms/bixby/` in the example project, you will find another folder, `models/Jovo/`. This folder contains predefined models, required for the platform integration to work properly.

### Jovo Primitives

Inside `primitives/`, you will find three primitive concepts.

`JovoSessionId` of type `text` acts as a unique identifier for the current session. Once your capsule is launched, a new session will be constructed, containing data for the entire session, such as data you set yourself in your voice app or context about the current user.

> Learn more about session data in Jovo [here](https://www.jovo.tech/docs/data#session-data).

`JovoSpeech` forms the speech output of your capsule. Unfortunately, there is no reprompt functionality, so you only have one dialog output. If you want to use SSML, note that Bixby currently supports the following SSML tags:

- `<lang>`
- `<audio>`
- `<say-as>`
- `<s>`
- `<p>`
- `<sub>`

> Learn more about using SSML with Bixby [here](https://bixbydevelopers.com/dev/docs/reference/ref-topics/ssml).

> Learn more about the Jovo SpeechBuilder [here](https://www.jovo.tech/docs/output/speechbuilder).

`JovoText` same as JovoSpeech but with SSML removed.

`JovoState` describes the current state of your voice app.

> Learn more about states in Jovo [here](https://www.jovo.tech/docs/routing/states).

### Jovo Structures

#### JovoLayout

`JovoLayout` is an experimental structure for the platform integration. Currently, there is no real functionality for creating a layout with the platform integration, but you can add your own properties to the structure to use in your capsule.

> Learn more about layout [here](https://www.jovo.tech/marketplace/jovo-platform-bixby/layout).

#### JovoSessionData

This structure describes session data, which will be passed between Bixby and your Jovo application. Mandatory properties are `_JOVO_SESSION_ID_` and `_JOVO_STATE_`, implementing the Jovo primitives we discussed before. If you want to use your own session values, you need to manually create a respective concept type and add the property in the `JovoSessionData` structure.

```bxb
structure (JovoSessionData) {
  description (Session Data)

  property(_JOVO_SESSION_ID_) {
    type(JovoSessionId)
    max (One)
    min (Required)
  }

  property(_JOVO_STATE_) {
    type(JovoState)
    max (One)
    min (Optional)
  }

  // Paste your own session properties here
  property(name) {
    type (NameInput)
    max (One)
    min (Optional)
  }
}
```

Note that your own properties must be optional and of cardinality `One`.

> Learn more about session data in Jovo [here](https://www.jovo.tech/docs/data#session-data).

#### JovoResponse

`JovoResponse` is a structure for the response object, which allows communication between your capsule and your Jovo app. It features all yet available functionality as properties, such as speech SSML output `_JOVO_SPEECH_` of type `JovoSpeech`, text output `_JOVO_TEXT_` of type `JovoText`, `_JOVO_LAYOUT` for adding layouts to your capsule and `_JOVO_SESSION_DATA_` for session data.

```bxb
structure (JovoResponse) {
  description (Response from Jovo Framework)

  property (_JOVO_SESSION_DATA_) {
    type (JovoSessionData)
    min (Optional)
    max (One)
  }

  property(_JOVO_AUDIO_) {
    type(audioPlayer.AudioInfo)
    min (Optional)
    max (One)
  }

  property(_JOVO_SPEECH_) {
    type(JovoSpeech)
    min (Optional)
    max (One)
  }

  property(_JOVO_TEXT_) {
    type(JovoText)
    min (Optional)
    max (One)
  }

  property (_JOVO_LAYOUT_) {
    type(JovoLayout)
    min (Optional)
    max (One)
  }
}
```

The property `_JOVO_AUDIO_` can be used for playing a playlist of audio files.

> Learn more about playing audio with Bixby [here](https://www.jovo.tech/marketplace/jovo-platform-bixby/audioplayer).

### Jovo Actions

As of `v3.0`, there is only one action predefined in `models/Jovo/actions/`, `JovoPlayAudioAction`. This action features a computed input, meaning that this input does not come from the user directly, it rather derives from other inputs. In this case, a returned `JovoResponse` is used to compute the audio input of type `audioPlayer.Result` by accessing the response property `_JOVO_AUDIO_`.

```bxb
action (JovoPlayAudioAction) {
  description (Takes a JovoRespone as an input and computes a playable audio object.)
  type(Search)

  collect {
    input (_JOVO_PREV_RESPONSE_) {
      type(JovoResponse)
      min (Required)
      max (One)
    }

    computed-input (audio) {
      type(audioPlayer.Result)
      compute {
        intent {
          goal: audioPlayer.PlayAudio
          value: $expr(_JOVO_PREV_RESPONSE_._JOVO_AUDIO_)
        }
      }
    }
  }
  output (JovoResponse)
}
```

> Learn more about playing audio with Bixby [here](https://www.jovo.tech/marketplace/jovo-platform-bixby/audioplayer).

## Bixby AudioPlayer

> [You can find more about Bixby Audioplayer support here](https://www.jovo.tech/marketplace/jovo-platform-bixby/audioplayer).

## Bixby Layouts

While dialogs contain speech output for your user, layouts allow you to display results or prompt the user for interaction, such as providing additional data by selecting an element from a list. Currently, we don't provide dedicated helper functions in the way we do for the Bixby AudioPlayer, but you can use `addLayoutAttribute(key, value)` to add any properties to the layout attribute in your response.

```js
// @language=javascript

// app.js

LAUNCH() {
  // A property 'text' will be added to the 'JovoResponse' object inside '_JOVO_LAYOUT_'
  this.$bixbyCapsule.addLayoutAttribute('text', 'Hello World.');

  this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
}

// @language=typescript

// app.ts

LAUNCH() {
  // A property 'text' will be added to the 'JovoResponse' object inside '_JOVO_LAYOUT_'
  this.$bixbyCapsule!.addLayoutAttribute('text', 'Hello World.');

  this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
}
```

Now, you have to provide Bixby with enough information, so it knows to expect a layout property `text`. Go ahead and add a primitive `LayoutText` to your `primitives/` folder, then add that property to the `JovoLayout` structure located inside `models/Jovo/structures/`.

```bxb
text (LayoutText) {
  description (A text that will be displayed.)
}
```

```bxb
structure (JovoLayout) {
  description (Layout structure. Add your fields for usage.)

  // Paste your own layout properties here.
  property (text) {
    type(LayoutText)
    min (Optional)
    max (One)
  }
}
```

Finally, add the property to your layout file. If you are starting with our example capsule, it should be located in `resources/en/layouts/`.

```bxb
// Result.view.bxb

render {
  layout {
    section {
      content {
        single-line {
          text {
            value("#{value (response._JOVO_LAYOUT_.text)}")
          }
        }
      }
    }
  }
}
```

When you now launch your capsule, you should see your layout property displayed.

![Layout Example](./img/bixby-simulator-layout.png 'Your layout property is now being properly displayed.')

> [You can find more about Bixby Layouts support here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/building-views.layouts).