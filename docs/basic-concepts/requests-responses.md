# Requests and Response

Learn more about the general architecture and lifecycle of voice app requests and responses.

* [Introduction](#introduction)

## Introduction



A `session` is an uninterrupted interaction between a user and your application. It consists of at least one `request`, but can have a series of inputs and outputs. A session can end for the following reasons:

* The response includes `shouldEndSession`, which is true for `tell` and `endSession` method calls
* A user doesn't respond to an ask prompt and the session times out
* The user asks to end the session by saying "quit" or "exit"

Sessions that contain only a single request with a `tell` response could look like this:

![One Session](../../img/session-tell.png)


For more conversational experiences that require back and forth between your app and user, you need to use the `ask` method. Here is what a session with two requests could look like:

![Two Sessions](../../img/session-ask.png)

To save user data in form of attributes across requests during a session, take a look at the [Session Attributes](#session-attributes) section below. The platforms don't offer the ability to store user data across sessions. For this, Jovo offers a [Persistence Layer](../../06_integrations/databases#filepersistence './databases#filepersistence').


<!--[metadata]: {"description": "Learn more about the general architecture and lifecycle of voice app requests and responses.",
		        "route": "requests-responses"}-->
