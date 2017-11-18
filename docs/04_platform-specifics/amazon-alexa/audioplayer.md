# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Audioplayer

Learn more about how to build Alexa AudioPlayer Skills with the Jovo Framework.

* [Introduction to AudioPlayer Skills](#introduction-to-audioplayer-skills)
* [Features](#features)
  * [Play a File](#play-a-file)
  * [Enqueue](#enqueue)
  * [Stop](#stop)
* [AudioPlayer Directives](#audioplayer-directives)

## Introduction to AudioPlayer Skills

AudioPlayer Skills can be used to stream long-form audio files like music. Here is the [official reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference).

You get access to the `audioPlayer` object like this:

```javascript
let audioPlayer;

exports.handler = function(event, context, callback) {
    app.handleRequest(event, callback, handlers);
    
    // Get audioPlayer object with new request
    audioPlayer = app.alexaSkill().audioPlayer();
    app.execute();
};

```


## Features

### Play a File

```javascript
play(url, token, playBehavior)

// Start playing a file from the beginning
audioPlayer.setOffsetInMilliseconds(0)
    .play(url, token)
    .tell(speech);
```

### Enqueue

```javascript
enqueue(url, token)
```

### Stop

```javascript
audioPlayer.stop();
```


## AudioPlayer Directives

Add the following to your handlers variable:

```javascript
const handlers = {

    // Other intents

    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            console.log('AudioPlayer.PlaybackStarted');
            
            // Do something
            
            app.endSession();
        },

        'AudioPlayer.PlaybackNearlyFinished': function() {
            console.log('AudioPlayer.PlaybackNearlyFinished');
            
            // Do something
            
            app.endSession();
        },

        'AudioPlayer.PlaybackFinished': function() {
            console.log('AudioPlayer.PlaybackFinished');
            
            // Do something
            
            app.endSession();
        },

        'AudioPlayer.PlaybackStopped': function() {
            console.log('AudioPlayer.PlaybackStopped');
            
            // Do something

            app.endSession();
        },

    },

};

```

Note that it's important to have an `emit` at the end of the functions to be able to e.g. save user data. In the example above, we're using `endSession` for this.