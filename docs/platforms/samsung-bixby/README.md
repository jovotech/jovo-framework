# Samsung Bixby

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

With the launch of `v3.0.0` of the Jovo Framework, we introduced a new platform integration for Samsung Bixby. It enables you to program highly scalable cross-platform voice applications for Bixby and use the countless integrations for the Jovo Framework, such as persistent user storage and Content-Management-Systems.

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

![Primitive Example](../../img/bixby-primitives-example.png 'This is an example for a primitive.')

Primitives are the simplest building blocks of a Bixby Capsule and are able to hold data like text, numbers or boolean values. Primitives can be used to form [structures](#structures), inputs or outputs for [actions](#actions), for example.

> Read more about primitives [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/modeling.modeling-concepts#primitive-concepts).

#### Structures

![Primitive Example](../../img/bixby-structures-example.png 'This is an example for a primitive.')

While primitives describe very simple data types, structures form more complex data sets, containing any number of properties. Each property is a concept by itself, with a specific set of attributes, describing their role and behaviour.

Each property is required to define it's type, optionality and cardinality. The type can be either a primitive or another structure, if you need to handle more complex data in nested structures. The keyword `min` defines the properties optionality, which can be either `Required` or `Optional`. `max` sets the properties cardinality, defining whether the property allows for more than one value. Valid values are `One` or `Many`. By default, each property has the attributes `min(Optional)` and `max(One)`.

If you want to enhance a structure, you can use the `extends` feature, which allows you to inherit the parent structure's properties and extend them by adding new properties.

![Primitive Example](../../img/bixby-structures-extend.png 'This is an example for a primitive.')

If you want to assign a more specific role to your structure without altering any properties, you can use the `role-of` feature. This allows you to specialize a certain structure, so Bixby can distinguish between the same concept for different use cases.

![Primitive Example](../../img/bixby-structures-roleof.png 'This is an example for a primitive.')

> Read more about structures [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/modeling.modeling-concepts#structure-concepts).

#### Actions

![Primitive Example](../../img/bixby-actions-example.png 'This is an example for a primitive.')

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

> Learn more about using layouts [here](./layouts.md './samsung-bixby/layouts').

### Training

Training Bixby is similar to Alexa's interactive model. You provide a number of training samples, or utterances, which will be used by Bixby to understand your user's intents and how to differentiate between inputs. For that process, Bixby offers a training tool, which provides you with a visual interface for entering and specifying user utterances. Every utterance is required to specify a goal and optional inputs. A goal must be a model, either a concept or an action, depending on your use case. To reach that goal, you might need a number of inputs to satisfy the action or concept. To mark a part of your utterance as an input parameter, you need to specify it's type, so Bixby can associate it with required inputs specified in your goal.

![Training Example](../../img/bixby-training.png 'This is how an example utterance in the training tool looks like.')

In this example training utterance, our goal will be `MyNameIsAction`, which requires an input primitive `NameInput` of type `text`.

> Learn more about training [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/training.intro-training).

The `training` file contains all of your capsule's natural language models, which are being used by Bixby to understand your user prompts and how to differentiate between inputs. For every training sample, a goal must be specified, telling Bixby what action to execute on that sample. Furthermore, you can specify inputs with associated nodes or even routes for Bixby to collect additional information.

### Configuration

Bixby offers multiple ways for setting certain configurations, either for the deployment process or properties for the capsule to work with while operating.

#### Capsule Properties and Endpoints

In your Bixby capsule, you're most likely to come across a `capsule.properties` file. This file acts similar to a `.env` file, as it stores configuration information, which could be changed without altering any models or code. For the platform integration, this file is required to contain your webhook url for communication between Bixby and the Jovo Framework.

As mentioned, Bixby uses your models to outline your capsule and to get an idea of what data to expect and how to handle it. To couple your models with your code logic, Bixby needs a way to know, which action model to associate with a certain part of your code. There are two ways to do this: local endpoints and remote endpoints. Per default, Bixby uses local endpoints in the form of javascript files, which export a single function executing your code and returning an output according to the associated model. Remote endpoints on the other hand allow you to outsource your code logic to a remote server and provide it's endpoint to Bixby, which, upon a user prompt, will send a post request to your server, where you can handle the action and return a valid response. The platform integration uses that feature to allow communication between the Jovo voice app and your capsule.

![Primitive Example](../../img/bixby-endpoints.png 'This is an example for a primitive.')

Note that we use the property `remote.url` as a prefix, which references the url we set in `capsule.properties`. Additionally, you have to specify which intent you want to trigger with your action by providing a query parameter `intent` in the endpoint's url. For your `LaunchAction`, you don't have to specify an intent.

> Read more about configuring endpoints [here](https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.configuring-endpoints).

#### Deployment Configuration

Bixby provides multiple ways of adding configuration to your capsule, and depending on it's use case, it will be located in different files.

![Primitive Example](../../img/bixby-configuration-info.png 'This is an example for a primitive.')

`capsule-info.bxb` holds all of your capsule's information, such as it's display name, a description and certain search keywords.

> Learn more about `capsule-info.bxb` [here](https://bixbydevelopers.com/dev/docs/reference/type/capsule-info).

![Primitive Example](../../img/bixby-configuration-hints.png 'This is an example for a primitive.')

To be marketplace compliant, your capsule needs to provide hints in a `.hints.bxb` file. Hints are used by Bixby to provide your users with utterance suggestions, so they get an idea of how your capsule works and what they can achieve with it.

> Learn more about hints [here](https://bixbydevelopers.com/dev/docs/reference/type/hints).

![Primitive Example](../../img/bixby-configuration-capsule.png 'This is an example for a primitive.')

Last, but not least, `capsule.bxb` acts as a place for deployment configuration for your capsule, such as it's version, library imports, runtime flags and deployment targets.

> Learn more about `capsule.bxb` [here](https://bixbydevelopers.com/dev/docs/reference/type/capsule).

## Jovo Models

When you start a new capsule with the intent of using the platform integration with the Jovo Framework, it is recommended to start with our [Jovo Bixby Capsule Example](https://github.com/jovotech/jovo-bixby-capsule-example). Not only does it come with our [Hello World Template](https://www.jovo.tech/templates/helloworld), it also includes all Jovo models required for the integration to work properly.

Usually, all models have their respective folders, such as `actions/` for actions, `primitives/` for primitives and so on. However, in our example capsule, located inside `platforms/bixby/` in the example project, you will find another folder, `models/Jovo/`. This folder contains predefined models, required for the platform integration to work properly.

### Jovo Primitives

Inside `primitives/`, you will find three primitive concepts.

`JovoSessionId` of type `text` acts as a unique identifier for the current session. Once your capsule is launched, a new session will be constructed, containing data for the entire session, such as data you set yourself in your voice app or context about the current user.

> Learn more about session data in Jovo [here](https://www.jovo.tech/docs/data#session-data).

`JovoSpeech` forms the speech output of your capsule. Unfortunately, there is no reprompt functionality, so you only have one dialog output. If you want to use SSML, note that Bixby currently supports the following SSML tags:

- `<lang>`
- `<audio>`

> Learn more about using SSML with Bixby [here](https://bixbydevelopers.com/dev/docs/reference/ref-topics/ssml).

> Learn more about the Jovo SpeechBuilder [here](https://www.jovo.tech/docs/output/speechbuilder).

`JovoState` describes the current state of your voice app.

> Learn more about states in Jovo [here](https://www.jovo.tech/docs/routing/states).

### Jovo Structures

#### JovoLayout

`JovoLayout` is an experimental structure for the platform integration. Currently, there is no real functionality for creating a layout with the platform integration, but you can add your own properties to the structure to use in your capsule.

> Learn more about layout [here](./layout.md './samsung-bixby/layout').

#### JovoSessionData

This structure describes session data, which will be passed between Bixby and your Jovo application. Mandatory properties are `_JOVO_SESSION_ID_` and `_JOVO_STATE_`, implementing the Jovo primitives we discussed before. If you want to use your own session values, you need to manually create a respective concept type and add the property in the `JovoSessionData` structure.

![JovoSessionData](../../img/bixby-structures-sessiondata.png 'JovoSessionData')

Note that your own properties must be optional and of cardinality `One`.

> Learn more about session data in Jovo [here](https://www.jovo.tech/docs/data#session-data).

#### JovoResponse

`JovoResponse` is a structure for the response object, which allows communication between your capsule and your Jovo app. It features all yet available functionality as properties, such as speech output `_JOVO_SPEECH_` of type `JovoSpeech`, `_JOVO_LAYOUT` for adding layouts to your capsule and `_JOVO_SESSION_DATA_` for session data.

![JovoResponse](../../img/bixby-structures-response.png 'JovoResponse')

The property `_JOVO_AUDIO_` can be used for playing a playlist of audio files.

> Learn more about playing audio with Bixby [here](./audioplayer.md './samsung-bixby/audioplayer').

### Jovo Actions

As of `v3.0.0`, there is only one action predefined in `models/Jovo/actions/`, `JovoPlayAudioAction`. This action features a computed input, meaning that this input does not come from the user directly, it rather derives from other inputs. In this case, a returned `JovoResponse` is used to compute the audio input of type `audioPlayer.Result` by accessing the response property `_JOVO_AUDIO_`.

![JovoPlayAudioAction](../../img/bixby-actions-playaudio.png 'JovoPlayAudioAction')

> Learn more about playing audio with Bixby [here](./audioplayer).

## Bixby AudioPlayer

> [You can find more about Bixby Audioplayer support here](./audioplayer.md './samsung-bixby/audioplayer').

## Bixby Layouts

> [You can find more about Bixby Layouts support here](./layouts.md './samsung-bixby/layouts').

<!--[metadata]: {"description": "Learn the essentials of Bixby and the new platform integration for the Jovo Framework.",
		"route": "samsung-bixby"}-->
