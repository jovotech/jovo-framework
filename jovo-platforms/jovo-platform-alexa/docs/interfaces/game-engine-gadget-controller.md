# Echo Button and Gadget Skills

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-alexa/interfaces/game-engine-gadget-controller

* [GadgetController Interface](#gadgetcontroller-interface)
  * [Set Light](#set-light)
    * [Animations](#animations)
      * [Sequence](#sequence)
* [Game Engine Interface](#game-engine-interface)
  * [Recognizers](#recognizers)
    * [Pattern Recognizer](#pattern-recognizer)
    * [Pattern Object](#pattern-object)
    * [Deviation Recognizer](#deviation-recognizer)
    * [Progress Recognizer](#progress-recognizer)
  * [Events](#events)
    * [StartInputHandler](#startinputhandler)
    * [StopInputHandler](#stopinputhandler)
    * [Input Handler Events](#input-handler-events)

##  GadgetController Interface

With the `GadgetController` interface you can create animations for the light bulb in the Echo Button.

But first you have to enable the `GadgetController` interface either in your `project.js` file, if you're working with the [Jovo CLI](https://github.com/jovotech/jovo-cli), or in the Alexa Developer Console in the `Interfaces` tab.

To do it with the Jovo CLI simply add the interface to the `alexaSkill` object in your `project.js`:

```javascript
module.exports = {

  alexaSkill: {
    manifest: {
      apis: {
        custom: {
          interfaces: [
            {
              type: 'GADGET_CONTROLLER',
            }
          ],
        },
      },
    },
  }

  // ...
}

```
Don't forget to build and deploy your project after you've added the interface:

```sh
# Build platform specific files
$ jovo3 build

# Deploy to platforms
$ jovo3 deploy
```

### Set Light

To change the light of the user's Echo Buttons you have to use the `GadgetController.SetLight` directive

```javascript
{
   "type": "GadgetController.SetLight",
   "version": 1,
   "targetGadgets": [ "gadgetId1", "gadgetId2" ],
   "parameters": {
      "triggerEvent": "none",
      "triggerEventTimeMs": 0,
      "animations": [
       {
          "repeat": 1,
          "targetLights": ["1"],
          "sequence": [
           {
              "durationMs": 10000,
              "blend": false,
              "color": "0000FF"
           }
          ]
        }
      ]
    }
}
```
The directive has the following parameters you have to set:
Name | Description | Value | Required
:--- | :--- | :--- | :---
`targetGadgets` | Specify the gadget IDs to which the animation should be applied. If you don't specify the target gadgets, every single one will receive the animation | `String[]` with gadget IDs | no
`triggerEventTimeMs` | The amount of time to wait after the trigger event before playing the animation | `Number` min: 0, max: 65535 | yes
`triggerEvent` | Specify the action that triggers the animation. Either `buttonDown` (button pressed), `buttonUp` (button released) or `none` (trigger animation as soon as the directive arrives) | `String` | yes
`animations` | Array of animations you want to use | `Object[]` | yes

```javascript
// @language=javascript

this.$alexaSkill.$gadgetController.setLight(
  [],
  0,
  'buttonDown',
  [animationOne, animationTwo, animationThree]
);

// @language=typescript

this.$alexaSkill!.$gadgetController.setLight(
  [],
  0,
  'buttonDown',
  [animationOne, animationTwo, animationThree]
);

```

#### Animations

The `animations` object contains the animation steps in chronological order as well as the number of repetitions.

```javascript
"animations": [
  {
    "repeat": 1,
    "targetLights": ["1"],
    "sequence": [
      {
        "durationMs": 10000,
        "blend": false,
        "color": "0000FF"
      }
    ]
  }
]
```
Name | Description | Method | Value | Required
:--- | :--- | :--- | :--- | :---
`repeat` | The number of times to play the animation | `repeat(repeat)` | `Number` min: 0, max: 255 | yes
`targetLights` | Array of Strings representing the lights on the device. Since the Echo Button only has one **you have to use `['1']`** | `targetLights(targetLights)` | `String[]` | yes
`sequence` | Array of objects, which define the animation. The array has to be in chronological order | `sequence(sequence)` | `Object[]` | yes

```javascript
// @language=javascript

const animationOne = this.$alexaSkill.$gadgetController.getAnimationsBuilder();

animationOne.repeat(3).targetLights(['1']).sequence(sequence);

// @language=typescript

const animationOne = this.$alexaSkill!.$gadgetController.getAnimationsBuilder();

animationOne.repeat(3).targetLights(['1']).sequence(sequence);
```

##### Sequence

A `sequence` is simply an array of steps, which can each have a different color, duration, etc.. Every sequence can only have a set amount of steps, which depends on the number of gadgets that sequence has to be applied to. Amazon provides a formula to calculate the number of steps allowed: `maxStepsPerSequence = 38 - numberOfTargetGadgetsSpecified * 3`.

You can also have a zero-step animation that will clear the current animation set for the trigger.
```javascript
"sequence": [
  {
    "durationMs": 10000,
    "blend": false,
    "color": "0000FF"
  }
]
```

A sequence has the following parameter:

Name | Description | Method | Value | Required
:--- | :--- | :--- | :--- | :---
`durationMs` | The duration of the step in milliseconds | `duration(duration)` | `Number` in milliseconds | yes
`color` | The desired color | `color(color)` | `String` in RGB hexadecimal notation | yes
`blend` | Choose if you want the previous color to smoothly change to this step's one | `blend(blend)` | `boolean` | yes

```javascript
// @language=javascript

const sequence = this.$alexaSkill.$gadgetController.getSequenceBuilder();

sequence.duration(2).color('FFFFFF');

// @language=typescript

const sequence = this.$alexaSkill!.$gadgetController.getSequenceBuilder();

sequence.duration(2).color('FFFFFF');
```

## Game Engine Interface

The Alexa `GameEngine` interface provides the toolset to receive Echo Button events using the *Input Handler*. 

To get a better understanding how the `GameEngine` interface works you should go for a bottom up approach since everything is built in top of each other. Therefore we will start with the `Recognizers` first proceed with the `Events`, go over the `Start-` and `StopInputHandler` directive and finish with the `InputHandlerEvents`.

But first you have to enable the `GameEngine` interface either in your `project.js` file, if you're working with the [Jovo CLI](https://github.com/jovotech/jovo-cli), or on the Alexa Developer Console in the `Interfaces` tab.

To do it with the Jovo CLI simply add the interface to the `alexaSkill` object in your `project.js`:

```javascript
module.exports = {
  alexaSkill: {
    manifest: {
      apis: {
        custom: {
          interface: [
            {
              type: 'GAME_ENGINE',
            }
          ],
        },
      },
    },
  },

  // ...
}
```

Don't forget to build and deploy your project after you've added the interface:

```sh
# Build platform specific files
$ jovo3 build

# Deploy to platforms
$ jovo3 deploy
```

### Recognizers

The primary use case of recognizers is to track Echo Button inputs to look for patterns, which were defined at the creation of the respective recognizer. These are called `PatternRecognizer`.

There are also two varations, which can either track the progress of another recognizer or check if the user has deviated from an expected pattern, called `ProgressRecognizer` and `DeviationRecognizer` respectively.

Recognizers are either `true` or `false` at any point of time.
Examples:
* The user has not reached the defined progress of your `ProgressRecognizer`, which means the recognizer is currently `false`.
* The user has deviated from the pattern you specified in the `DeviationRecognizer`, which means the recognizer is currently `true`.

#### Pattern Recognizer

As described earlier, the `PatternRecognizer` tracks the raw Echo Button events to look for the specified pattern.

```javascript
"myRecognizerName": {
  "type": "match",
  "anchor": "end",
  "fuzzy": true,
  "gadgetIds": [ "gadgetId1", "gadgetId2", "gadgetId3" ],
  "actions": [ "down", "up" ],
  "pattern": [
    {
      "action": "down",
      "gadgetIds": [ "gadgetId1", "gadgetId2" ],
      "colors": [ "0000FF" ]
    }
  ]
}
```
Name | Description | Method | Value | Required
:--- | :--- | :--- | :--- | :---
`anchor` | Define where the pattern has to appear in raw Echo Button event history. Either at the `start` (first event in the pattern must be the first event in the history), at the `end` (last event in the pattern must be last event in the history) or `anywhere` (the pattern can appear anywhere in the history) | `patternAnchor(anchor)` | `String` | no
`fuzzy` | Decide how strict the pattern match is. While true it will recognize the pattern even if there are extra events in between. Here's an example from Amazon: "Consider a pattern that requires three down events while the button is colored red. If the player presses the button four times with the pattern "red, red, green, red," then fuzzy matching would accept the overall match, while non-fuzzy matching would reject the match." | `fuzzy(fuzzy)` | `boolean` | no
`gadgetIds` | Specify which gadgets should be tracked for the pattern using their respective gadgetIds | `gadgetIds(gadgetIds)` | `String[]` | no
`actions` | Specify the actions to consider for this pattern. `down` (button is pressed), `up` (button is released), `silence` (no action) | `actions(actions)` | `String[]` | no
`pattern` | An array of `pattern` objects ordered chronologically. | `pattern(pattern)` | `Object[]` | yes

#### Pattern Object

A `pattern` object has three values, namely `gadgetIds`, `colors` and `action`. None of the values are required, but if they are left out, they will be handled as *wildcards*, i.e. everything works.

Name | Description | Value
:--- | :--- | :---
`gadgetIds` | Specify which gadgets should be eligible for this match | `String[]`
`colors` | Specify the colors that should be eligible for this match | `String[]` - RGB hexadecimal notation
`action` | Specify the action that must match. Either `down`, `up` or `silence` (the same as above). | `String`

```javascript
let testPattern = {
  action: "down",
  colors: [
    "0000FF",
    "FF0000"
  ]
}
```

##### Code Example for Pattern Recognizer

To create a `PatternRecognizer` you need the `PatternRecognizerBuilder`:

```javascript
// @language=javascript

let patternRecognizer = this.$alexaSkill.$gameEngine.getPatternRecognizerBuilder('recognizerName');

// @language=typescript

let patternRecognizer = this.$alexaSkill!.$gameEngine.getPatternRecognizerBuilder('recognizerName');
```

With the builder you can use the methods described above:
```javascript
let patternOne = {
  action: "down",
  colors: [
    "0000FF",
    "FF0000"
  ]
};
patternRecognizer
  .patternAnchor('end')
  .fuzzy(true)
  .pattern([pattern]);
```

#### Deviation Recognizer

The deviation recognizer is used to check if the player has deviated from an expected pattern defined in one of your pattern recognizers.
```javascript
"playerHasFailed": {
  "type": "deviation",
  "recognizer": "recognizerName"
}
```

Name | Description | Method | Value | Required
:--- | :--- | :--- | :--- | :---
`recognizer` | Name of the recognizer where the pattern was defined | `recognizer(nameOfPatternRecognizer)` | `String` | yes
 
##### Code Example for Deviation Recognizer

To create a `DeviationRecognizer` you need the `DeviationRecognizerBuilder`:

```javascript
// @language=javascript

let deviationRecognizer = this.$alexaSkill.$gameEngine.getDeviationRecognizerBuilder('recognizerName');

// @language=typescript

let deviationRecognizer = this.$alexaSkill!.$gameEngine.getDeviationRecognizerBuilder('recognizerName');
```
With the builder you can use the method described above:

```javascript
deviationRecognizer.recognizer('myPatternRecognizer');
```

#### Progress Recognizer

The progress recognizer is used to monitor how close the user is to completing the pattern of one of your pattern recognizers.

```javascript
"halfwayThere": {
  "type": "progress",
  "recognizer": "patternMatcher",
  "completion": 50
}
```

Name | Description | Method | Value | Required
:--- | :--- | :--- | :--- | :---
`recognizer` | Name of the recognizer where the pattern was defined | `recognizer(nameOfPatternRecognizer)` | `String` | yes
`completion` | The point from which on the recognizer is `true` | `completion(completion)` | `Number` (e.g `50` = `50%`) | yes


##### Code Example for Progress Recognizer

To create a `ProgressRecognizer` you need the `ProgressRecognizerBuilder`:

```javascript
// @language=javascript

let progressRecognizer = this.$alexaSkill.$gameEngine.getProgressRecognizerBuilder('recognizerName');

// @language=typescript

let progressRecognizer = this.$alexaSkill!.$gameEngine.getProgressRecognizerBuilder('recognizerName');
```


With the builder you can use the methods described above:

```javascript
progressRecognizer
  .recognizer('myPatternRecognizer')
  .completion(75);
```

### Events

Events are used to define the conditions under which your skill will be notified of Echo Button input. You define these conditions using the recognizers we discussed above.

```javascript
"myEventName": {
  "meets": [ "a recognizer", "a different recognizer" ],
  "fails": [ "some other recognizer" ],
  "reports": "history",
  "shouldEndInputHandler": true,
  "maximumInvocations": 1,
  "triggerTimeMilliseconds": 1000    
}
```

Name | Description | Method | Value | Required
:--- | :------- | :--- | :--- | :---
`meets` | When all the recognizers you specified here are true, your skill will be notified | `meets(meets)` | `String[]` | yes
`fails` | If any of recognizers specified here are true, your skill won't receive a notification | `fails(fails)` | `String[]` | no
`reports` | Specify which raw button events should be sent with the notification. Either `history` (all button events since the *Input Handler* was started), `matches` (all button events that contributed to this event) or `nothing` (no button events. **Default**) | `reports(report)` | `String` | no
`shouldEndInputHandler` | Specify if the *Input Handler* should end after receiving the event | `shouldEndInputHandler(shouldEnd)` | `boolean` | yes
`maximumInvocations` | Number of times the event can be sent to your skill | `maximumInvocation(maxInvocations)` | `Number` min & default: 1, max: 2048 | no
`triggerTimeMilliseconds` | Specify how many milliseconds have to have passed before the event can be sent out | `triggerTimeMilliseconds(triggerTime)` | `Number` min: 0, max: 300000 | no

#### Code Example for Events

To create an `Event` you need the `EventBuilder`:

```javascript
// @language=javascript

const eventOne = this.$alexaSkill.$gameEngine.getEventsBuilder('eventName');

// @language=typescript

const eventOne = this.$alexaSkill!.$gameEngine.getEventsBuilder('eventName');
```

With the builder you can use the methods described above:

```javascript
eventOne
  .meets(['progressRecognizerName'])
  .fails(['deviationRecognizerName'])
  .reports('history')
  .shouldEndInputHandler(false)
  .maximumInvocation(3)
  .triggerTimeMilliseconds(5000)
```

#### StartInputHandler

The `StartInputHandler` directive is the starting point at which you define the conditions under which your skill will receive the Echo Button events. At any point of time there can only be a single *Input Handler* active.

```javascript
{
  "type": "GameEngine.StartInputHandler",
  "timeout": 10000,
  "proxies": [ "one", "two" ],
  "recognizers": {
    "bothPressed": {
      "type": "match",
      "fuzzy": true,
      "anchor": "start",
      "pattern": [
        {
          "gadgetIds": [ "one" ],
          "action": "down"
        },
        {
          "gadgetIds": [ "two" ],
          "action": "down"
        }
      ]
    }
  },
  "events": {
    "allIn": {
      "meets": [ "bothPressed" ],
      "reports": "matches",
      "shouldEndInputHandler": true
    },
    "timeout": {
      "meets": [ "timed out" ],
      "reports": "history",
      "shouldEndInputHandler": true
    }
  }
}
```

The directive has the following four parameters, which are all required besides `proxies`:

Name | Description | Value
:--- | :--- | :---
`timeout` | Maximum run time of the *Input Handler* in milliseconds | `Number` min: 0, max: 90000
`proxies` | Temporary identifiers to assign to gadgets which your skill hasn’t yet discovered. You can use these *proxies* at places where you would normally use actual gadget IDs  | `String[]`
`recognizers` | Recognizers track Echo Button inputs to look for patterns, which were defined at the creation of the respective recognizer | `Object` min: 0, max: 20
`events` | Events use `recognizers` to determine whether your skill should be notified or not | `Object` min: 1, max: 32

```javascript
// @language=javascript

this.$alexaSkill.$gameEngine.startInputHandler(
  25000,
  ['one', 'two', 'three'],
  [patternRecognizerOne, patternRecognizerTwo, deviationRecognizer],
  [eventOne, eventTwo]
);

// @language=typescript

this.$alexaSkill!.$gameEngine.startInputHandler(
  25000,
  ['one', 'two', 'three'],
  [patternRecognizerOne, patternRecognizerTwo, deviationRecognizer],
  [eventOne, eventTwo]
);
```

#### StopInputHandler

You can at any point in time stop receiving Echo Button events using by stopping the *Input Handler*:

```javascript
// @language=javascript

this.$alexaSkill.$gameEngine.stopInputHandler()

// @language=typescript

this.$alexaSkill!.$gameEngine.stopInputHandler()
```

#### Input Handler Events

After you started the *Input Handler* your skill will be able to receive `InputHandlerEvents`. These are the events you specified beforehand and are received just like any other request. 
```javascript
{
  "version": "1.0",
  "session": {
    "application": {},
    "user": {},
    "request": {
      "type": "GameEngine.InputHandlerEvent",  
      "requestId": "amzn1.echo-api.request.406fbc75-8bf8-4077-a73d-519f53d172a4",
      "timestamp": "2017-08-18T01:29:40.027Z",
      "locale": "en-US",
      "originatingRequestId": "amzn1.echo-api.request.406fbc75-8bf8-4077-a73d-519f53d172d6",
      "events": [
        {       
          "name": "myEventName",
          "inputEvents": [
            {
              "gadgetId": "someGadgetId1",
              "timestamp": "2017-08-18T01:32:40.027Z",
              "action": "down",
              "color": "FF0000"
            }
          ]
        }
      ]
    }
  }
}
```
Jovo maps these requests to the built-in `ON_GAME_ENGINE_INPUT_HANDLER_EVENT` intent, where you can access the events sent with the request:

```javascript
ON_GAME_ENGINE_INPUT_HANDLER_EVENT() {
  const events = this.$request.getEvents();
  // ...
},
```

##### Responding to Input Handler Events

Responding to GameEngine requests is optional. If you do respond Alexa handles the respond the usual way with slight differences:
* Card will only be displayed on Echo devices with a screen, not the app.
* Responses to GameEngine requests can't end the skill session, which means the shouldEndSession parameter in your response will be ignored
* An error in your response won't end the session but rather trigger a System.ExceptionEncountered error request.

```javascript
{
  "type": "System.ExceptionEncountered",
  "requestId": "string",
  "timestamp": "string",
  "locale": "string",
  "error": {
    "type": "string",
    "message": "string"
  },
  "cause": {
    "requestId": "string"
  }
}
```