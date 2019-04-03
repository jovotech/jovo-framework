# Gadget Controller

The `GadgetController` interface allows you to control the user's Echo Buttons.

- [Overview](#overview)
- [Enable the Interface](#enable-the-interface)
- [Set Light](#set-light)
  - [Animations](#animations)
    - [Sequence](#sequence)

## Overview

With the `GadgetController` interface you can create animations for the light bulb in the Echo Button.

## Enable the Interface

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
$ jovo build

# Deploy to platforms
$ jovo deploy
```

## Set Light

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

### Animations

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

#### Sequence

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

<!--[metadata]: {"description": "Learn more about the Alexa Gadget Controller interface",
"route": "amazon-alexa/gadget-controller" }-->