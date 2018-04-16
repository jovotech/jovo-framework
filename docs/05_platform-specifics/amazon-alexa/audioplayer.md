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

You can get started by creating a new Jovo project with the [`alexa-audioplayer`](https://github.com/jovotech/jovo-templates/tree/master/02_alexa-audioplayer) template:

```sh
$ jovo new <directory> --template alexa-audioplayer
```

## Features

### Play a File

```javascript
play(url, token, playBehavior)

// Start playing a file from the beginning
this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0)
    .play(url, token)
    .tell(speech);
```

### Enqueue

```javascript
this.alexaSkill().audioPlayer().enqueue(url, token)
```

### Stop

```javascript
this.alexaSkill().audioPlayer().stop();
```


## AudioPlayer Directives

Add the following to your handlers variable:

```javascript
app.setHandler({

    // Other intents

    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            console.log('AudioPlayer.PlaybackStarted');
            
            // Do something
            
            this.endSession();
        },

        'AudioPlayer.PlaybackNearlyFinished': function() {
            console.log('AudioPlayer.PlaybackNearlyFinished');
            
            // Do something
            
            this.endSession();
        },

        'AudioPlayer.PlaybackFinished': function() {
            console.log('AudioPlayer.PlaybackFinished');
            
            // Do something
            
            this.endSession();
        },

        'AudioPlayer.PlaybackStopped': function() {
            console.log('AudioPlayer.PlaybackStopped');
            
            // Do something

            this.endSession();
        },

    },

});

```

Note that it's important to have an `emit` at the end of the functions to be able to e.g. save user data. In the example above, we're using `endSession` for this.



<!--[metadata]: {"title": " AudioPlayer Skills", "description": "Learn how to build Amazon Alexa AudioPlayer Skills with the Jovo Framework", "activeSections": ["platforms", "alexa", "alexa_audioplayer"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "framework/docs", "Platforms": "framework/docs/platforms",
"Amazon Alexa": "framework/docs/amazon-alexa", "AudioPlayer": "" }, "commentsID": "framework/docs/amazon-alexa/audioplayer" }-->
