# Samsung Bixby

Learn more about how Bixby works and how you can use it with the Jovo Framework. 

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

### Training

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


#### JovoSessionData

This structure describes session data, which will be passed between Bixby and your Jovo application. Mandatory properties are `_JOVO_SESSION_ID_` and `_JOVO_STATE_`, implementing the Jovo primitives we discussed before. As of `v0.0.1`, if you want to use your own session values, you need to manually create a respective primitive type and add the property in the `JovoSessionData` structure.

![Actions Example](./img/structure-sessiondata.png "This is an example for a primitive.")

#### JovoResponse

`JovoResponse` is perhaps the most important Jovo structure, as it describes an interface for the communication between your Jovo app and your Bixby capsule. Not only does in contain a property `_JOVO_SESSION_DATA_` of type `JovoSessionData`, but it also includes properties for dialog (`_JOVO_SPEECH_` of type `JovoSpeech`), layout (`_JOVO_LAYOUT_` of type `JovoLayout`) and audio (`_JOVO_AUDIO_` of type `audioPlayer.AudioInfo`).

![Actions Example](./img/structure-response.png "This is an example for a primitive.")

### Actions

As of `v0.0.1`, there is only one action predefined in the `Jovo/` folder, `JovoPlayAudioAction`. This action allows Bixby to compute an input of type `audioPlayer.Result`, which can be used to play a playlist of audiofiles. You can learn more about how the Bixby Audioplayer works [here]().


## Advanced Concepts

### AudioPlayer

> [You can find more about Audioplayer support here](./audioplayer.md './samsung-bixby/audioplayer').


### Layout
