# Jovo Output Object

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/output/object

Learn more about the Jovo `$output` object.

- [Introduction](#introduction)
- [Output Structure](#output-structure)
- [Output Middleware](#output-middleware)

## Introduction

The Jovo `$output` is a consolidated JSON object that is prepared during [routing](../routing '../routing'), and later turned into a response in the [`output` Middleware](#output-middleware).

You can access the object like this:

```js
this.$output;
```

If you log it after calling the [`tell` method](./README.md#tell '../#tell'):

```js
this.tell('Hello World!');
console.log(this.$output);
```

The logs for the `$output` object look like this:

```js
{
	tell: {
		speech: 'Hello World!';
	}
}
```

And the generated response would be the following:

```js
// @platform=Alexa
{
	"version": "1.0",
	"response": {
		"shouldEndSession": true,
		"outputSpeech": {
			"type": "SSML",
			"ssml": "<speak>Hello World!</speak>"
		}
	},
	"sessionAttributes": {}
}

// @platform=Google Assistant
{
	"fulfillmentText": "Hello World!",
	"outputContexts": [
		{
			"name": "projects/<project-id>/agent/sessions/<session-id>/contexts/google_assistant_welcome"
		},
		{
			"name": "projects/<project-id>/agent/sessions/<session-id>/contexts/actions_capability_screen_output"
		},
		{
			"name": "projects/<project-id>/agent/sessions/<session-id>/contexts/actions_capability_audio_output"
		},
		{
			"name": "projects/<project-id>/agent/sessions/<session-id>/contexts/google_assistant_input_type_keyboard"
		},
		{
			"name": "projects/<project-id>/agent/sessions/<session-id>/contexts/actions_capability_web_browser"
		},
		{
			"name": "projects/<project-id>/agent/sessions/<session-id>/contexts/actions_capability_media_response_audio"
		}
	],
	"payload": {
		"google": {
			"expectUserResponse": false,
			"richResponse": {
				"items": [
					{
						"simpleResponse": {
							"ssml": "<speak>Hello World!</speak>"
						}
					}
				]
			},
			"userStorage": "{\"userId\":\"<user-id>\"}"
		}
	}
}
```

If you are reading the logs returned from the server (e.g. AWS CloudWatch), you can use the `JSON.stringify()` method to turn the object into a human-readable JSON string response:

```js
this.tell('Hello World!');
console.log(JSON.stringify(this.$output, null, 4));

// Output:
{
    "tell": {
        "speech": "Hello World!"
    }
}
```

## Output Structure

The `$output` object can contain elements for `tell`, `ask`, as well visual and plaform-specific output.

For example, it looks like this after `ask`:

```js
{
  ask: {
    speech: 'Hello World! What\'s your name?',
    reprompt: 'Please tell me your name.'
  }
}
```

## Output Middleware

> [Learn more about the Jovo Framework Architecture here](../../advanced-concepts/architecture.md '../architecture').

The `output` middleware is used to turn the `$output` object into a `$response` object, as shown in the [Introduction](#introduction) above.

The middleware turns the cross-platform output into platform-specific JSON responses based on the platform the framework is currently interacting with. This is why the `$output` object is helpful for [Hooks](../../advanced-concepts/hooks.md '../hooks') and [Plugins](../../advanced-concepts/plugins.md '../plugins'), as they then only need to worry about the abstracted object, not any possible response JSON structure.

<!--[metadata]: {"description": "Learn more about the Jovo $output object.",
	            "route": "output/object"}-->
