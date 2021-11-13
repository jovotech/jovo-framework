# Using Conversational Components

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/components/using-components

Get an overview on how to use Conversational Components in your Jovo project.

- [Installation](#installation)
- [Configuration](#configuration)
- [$components](#components)
- [Delegate to the Component](#delegate-to-the-component)
  - [Parsing existing data](#parsing-existing-data)
- [$response](#response)

## Installation

Components are hosted on npm to make it easy to share them.

```sh
$ npm install jovo-component-get-phone-number --save
```

After installing the package you have to load it into your project using the `jovo load` command:

```sh
$ jovo3 load jovo-component-get-phone-number
```

```
// root folder
models/
src/
└── components/
    jovo-component-get-phone-number/
        └── models/
        └── src/
            └── i18n/
            └── config.js
            └── handler.js
project.js
```

After that have the enable the component using the the `useComponent(...components)` function:

```js
// @language=javascript
// src/app.js
const {
	GetPhoneNumber,
} = require('./components/jovo-component-get-phone-number');

app.useComponents(new GetPhoneNumber());

// @language=typescript
// src/app.ts

import { GetPhoneNumber } from './components/jovo-component-get-phone-number';

app.useComponents(new GetPhoneNumber());
```

## Configuration

Every component can be configured using your project's root config file:

```js
// @language=javascript
// config.js

module.exports = {
    // ...
    components: { // contains configuration of every component
        'jovo-component-get-phone-number': {
            numberOfFails: 5
        }
    }
};

// @language=typescript
// config.ts

const config = {
    // ...
    components: {
        'jovo-component-get-phone-number': {
            numberOfFails: 2
        }
    }
};

export = config;
```

The interface is the same as the component's default configuration, which should be documented in the component's README file.

It's generally not recommended to make any kind of changes to the component's handler or it's config directly.

The changes made here, will be merged into the component's default configuration.

As for customizing the component's responses, simply edit its respective i18n values for now. A better solution using an external CMS is planned.

## $components

Installed components can be referenced at runtime using the `$components` object, e.g. `this.$components.GetPhoneNumber` will reference the GetPhoneNumber component.

Each of them have the following properties:

| Name                  | Description                                                                                                            | Value    | Can be Undefined |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ---------------- |
| `config`              | The merged configuration object. Learn more [here](#configuration)                                                     | `object` | No               |
| `data`                | The data object is used to store the data the component is supposed to collect. It's later included in the `$response` | `object` | No, if active    |
| `name`                | The name of the component                                                                                              | `string` | No               |
| `onCompletedIntent`   | The name of the intent to which the component will route to after it's finished                                        | `string` | No, if active    |
| `stateBeforeDelegate` | The state in which the component was delegated to                                                                      | `string` | Yes              |
| `$response`           | The response object of the component after it's finished                                                               | `object` | No, if finished  |

## Delegate to the Component

To delegate the task to one of the components, you use the `delegate(componentName, options)` function.

| Name                          | Description                                                                                                                                                                                                                                                                                                                                          | Value    | Required |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| `componentName`               | The name of the component to which you want to delegate the task to                                                                                                                                                                                                                                                                                  | `string` | Yes      |
| `options`                     | The options for the delegation                                                                                                                                                                                                                                                                                                                       | `object` | Yes      |
| `options.onCompletedIntent`   | The name of the intent to which the component should route to as soon as it finished the task                                                                                                                                                                                                                                                        | `string` | Yes      |
| `options.data`                | The data object will be filled by the component with the data it is supposed to collect. For example, the `ScheduleMeeting` component would need the users email to finish its task.. It offers the possibility to provide data you've already collected, so the component doesn't have to ask for it again. See more [here](#parsing-existing-data) | `object` | No       |
| `options.stateBeforeDelegate` | The state to which the framework will route back to after the component is finished                                                                                                                                                                                                                                                                  | `string` | No       |

```js
// @language=javascript
// src/app.js

HelloWorldIntent() {
    const delegationOptions = {
        onCompletedIntent: 'HelloWorldIntent',
        data: {
            email: 'xyz@jovo.tech'
        }
    };

    this.delegate('jovo-component-schedule-meeting', delegationOptions);
}

// @language=typescript
// src/app.ts

HelloWorldIntent() {
    const delegationOptions: ComponentDelegationOptions = {
        onCompletedIntent: 'HelloWorldIntent',
        data: {
            email: 'xyz@jovo.tech'
        }
    };

    this.delegate('jovo-component-schedule-meeting', delegationOptions);
}
```

At that point the component will go through the necessary steps to fulfill the task and route back to your specified intent with a response.

### Parsing existing data

If you already have some of the data, which the component is supposed to collect for you, you can parse these values to the component using the `data` object in the delegation options.

In the following example, we pass the user's email in the delegation options of the `ScheduleMeeting` component, which needs it to send the user the meeting details:

```js
// @language=javascript
const delegationOptions = {
	data: {
		email: 'xyz@jovo.tech',
	},
};

this.delegate('jovo-component-schedule-meeting', delegationOptions);

// @language=typescript
const delegationOptions: ComponentDelegationOptions = {
	data: {
		email: 'xyz@jovo.tech',
	},
};

this.delegate('jovo-component-schedule-meeting', delegationOptions);
```

## $response

After a component routes back to your `onCompletedIntent`, there will always be a `$response` object set, which notifies you about the result of the delegation.

It has the following interface:

| Name     | Description                                                                                                                                                                                                                                                                              | Value                                       | Required |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------- |
| `status` | Represents the status of the component. Will be set to `SUCCESSFUL` if the component managed to collect the data without problems. Will be set to `REJECTED` if the user tried to stop the app at any point, e.g. _Alexa, stop_. Will be set `ERROR` if an error occurred at some point. | Either `SUCCESSFUL`, `REJECTED`, or `ERROR` | Yes      |
| `data`   | An object containing the data the component was supposed to collect. The content of the object will be different for each component                                                                                                                                                      | `object`                                    | Yes      |
| `error`  | An error object, which is only present if the status is set to `ERROR`                                                                                                                                                                                                                   | `Error`                                     | No       |

```js
// @language=javascript
const response = {
	status: 'SUCCESSFUL',
	data: {
		phoneNumber: '0123456789',
	},
};

// @language=typescript
const response: ComponentResponse = {
	status: 'SUCCESSFUL',
	data: {
		phoneNumber: '0123456789',
	},
};
```

In your `onCompletedIntent` you have to be prepared to handle all three possible statuses of a response:

```js
// @language=javascript
CompletedIntent() {
    const response = this.$components['jovo-component-get-phone-number'].$response;

    if (response.status === 'REJECTED') {
        // handle REJECTED
    }
    else if (response.status === 'ERROR') {
        // handle ERROR
    }
    else {
        // handle SUCCESSFUL
    }
}

// @language=typescript
CompletedIntent() {
    const response = this.$components['jovo-component-get-phone-number'].$response;

    if (response.status === 'REJECTED') {
        // handle REJECTED
    }
    else if (response.status === 'ERROR') {
        // handle ERROR
    }
    else {
        // handle SUCCESSFUL
    }
}
```

<!--[metadata]: {
  "description": "Learn how to utilize Conversational Components in your own project",
  "route": "components/using-components"
}-->
