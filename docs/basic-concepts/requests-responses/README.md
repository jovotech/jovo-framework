# Requests and Responses

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/requests-responses

Learn more about the general architecture and lifecycle of voice app requests and responses.

- [Introduction to Voice Interactions](#introduction-to-voice-interactions)
  - [Request](#request)
  - [Logic](#logic)
  - [Response](#response)
- [Sessions](#sessions)

## Introduction to Voice Interactions

The request and response lifecycle of a voice application has two key concepts:

- Session
- Interaction

Each interaction between a user and a voice application consists of an interaction pair with a `request` and a `response`.

![One Session](../img/session-tell.png)

### Request

The `request` is the incoming data that the voice platform sends to your app's endpoint. It consists of information like:

- User ID,
- [Intent](./routing/intents.md './routing/intents'), e.g. `MyNameIsIntent`
- [Input](./routing/input.md './routing/input'), e.g. `name`
- Session [data](./data, './data'), e.g. a [state](./routing/states.md './routing/states')

and other things that might be relevant to your app. You can access the incoming request with `this.$request`.

> [Find everything about the `$request` object here](./request.md './requests-responses/request').

### Logic

The app logic is what happens between an incoming request and sending back a response to the voice platform.

Usually, this includes:

- [Routing](./routing './routing') through intents, states, and variable user input
- [Data](./data, './data') input and storage
- Other things like business logic and API calls

> A great next step to learn more about the Jovo app logic is taking a look at [Routing](./routing './routing').

### Response

The `response` is what you send back to the platform after the `request` has been run through your app logic. It includes

- Speech output (text or audio URL)
- Visual output to display on screens
- Session data

> [Find more information on Output here](./ouput './output').

You can access the incoming request with `this.$response`.

> [Find everything about the `$response` object here](./response.md './requests-responses/response').

## Sessions

![Two Sessions](../img/session-ask.png)

A `session` is an uninterrupted interaction between a user and your application. It consists of at least one `request` and `response` interaction pair, but can have a series of inputs and outputs. A session can end for the following reasons:

- The response includes `shouldEndSession`, which is true for `tell` and `endSession` method calls
- A user doesn't respond to an ask prompt and the session times out
- The user asks to end the session by saying "quit" or "exit"

> [Learn more about how to use data across sessions here](./data './data').

<!--[metadata]: {"description": "Learn more about the general architecture and lifecycle of voice app requests and responses.",
		        "route": "requests-responses"}-->
