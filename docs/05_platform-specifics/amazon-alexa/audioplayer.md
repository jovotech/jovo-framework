# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Audioplayer

Learn more about how to build Alexa AudioPlayer Skills with the Jovo Framework.

* [Introduction to AudioPlayer Skills](#introduction-to-audioplayer-skills)
* [Features](#features)
  * [Play a File](#play-a-file)
  * [Enqueue](#enqueue)
  * [Stop](#stop)
  * [Start Over](#start-over)
  * [Clear Queue](#clear-queue)
  * [Set Track Metadata](#set-track-metadata)
* [AudioPlayer Directives](#audioplayer-directives)

## Introduction to AudioPlayer Skills

AudioPlayer Skills can be used to stream long-form audio files like music or podcasts. The audio file must be hosted at an Internet-accessible HTTPS endpoint. The supported formats for the audio file include AAC/MP4, MP3, and HLS. Bitrates: 16kbps to 384 kbps. More information can be found here at the [official reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference).

Get started by creating a new Jovo project with the [`alexa-audioplayer`](https://github.com/jovotech/jovo-templates/tree/master/alexa/audioplayer)
 template:

```sh
$ jovo new <directory> --template alexa-audioplayer
```

## Features

### Play
Play a file.
Speech will take place before the file begins to play.

play(url, token, playBehavior)

```javascript

// Start playing a file from the beginning
this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0)
    .play(url, token)
    .tell(speech);

// or for example playing with an offset.
var offset = 3000;
this.alexaSkill().audioPlayer().setOffsetInMilliseconds(offset)
    .play(url, token)
    .tell(speech);

// or specify PlayBehavior
this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0)
.play(url,token,'ENQUEUE')
.tell(speech)
```
Play has the following parameters.

| Name           | Description                                                                                                                                                                                                                                                                                                                                                                                     | Value  | Required                     |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|------------------------------|
| `url`          | Specify the URL source of your audio must be HTTPS                                                                                                                                                                                                                                                                                                                                              | String |         YES                     |
| `token`        | An opaque token that represents the audio stream. This token cannot exceed 1024 characters.                                                                                                                                                                                                                                                                                                     | String |       YES                      |
| `PlayBehavior` | Describes playback behavior. Accepted values: <br/> `REPLACE_ALL`: Immediately begin playback of the specified stream, and replace current and enqueued streams.<br/> `ENQUEUE`: Add the specified stream to the end of the current queue. This does not impact the currently playing stream. <br/>`REPLACE_ENQUEUED`: Replace all streams in the queue. This does not impact the currently playing stream. | String | NO - Defaults to REPLACE_ALL |### Enqueue

### Enqueue

Adds sepcified file to the play queue. remember that the URL must be HTTPS.
```javascript
this.alexaSkill().audioPlayer().enqueue(url, token)
```
| Name           | Description  | Value  | Required  |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|------------------------------|
| `url`          | Specify the URL source of your audio must be HTTPS     | String |  YES |
| `token`        | An opaque token that represents the audio stream. This token cannot exceed 1024 characters.  | String |   YES  |    

### Stop
Stops the current file from playing.

```javascript
this.alexaSkill().audioPlayer().stop();
```

### Start Over

Starts the file specified by the url from the beginning.

```javascript
this.alexaSkill().audioPlayer().startOver(url, token);

```
| Name           | Description  | Value  | Required  |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|------------------------------|
| `url`          | Specify the URL source of your audio must be HTTPS     | String |  YES |
| `token`        | An opaque token that represents the audio stream. This token cannot exceed 1024 characters.  | String |   YES  |    


### Clear Queue

Use to clear all the queue or just the enqueue files.

```javascript
this.alexaSkill().audioPlayer().clearQueue('CLEAR_ALL');

```
| Name           | Description  | Value  | Required  |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|------------------------------|
| `clearBehavior`          | `CLEAR_ALL` - to clear everything <br/>  `CLEAR_ENQUEUED`- to clear just the queue.   | String |  YES |


### Set Track Metadata

You can set track metadata that is used to show additional information for Alexa devices with a screen. Learn more about Audioplayer displays in the [official reference by Amazon](https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#audioplayer-display).


```javascript
this.alexaSkill().audioPlayer()
    .setTitle('First Track')
    .setSubtitle('A simple subtitle')
    .addArtwork('https://www.somewhere.com/image.png')
    .addBackgroundImage('https://www.somewhere.com/background.jpg')
    // The above method calls need to be before play()
    .play(url, token);
```

For more information about the album artwork and the background image, refer to the official [image guidelines by Amazon](https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#images). Here are the recommended minimum sizes:

* Artwork: 480 x 480 pixels
* Background image: 1024 x 640 pixels


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



<!--[metadata]: {"title": " AudioPlayer Skills", "description": "Learn how to build Amazon Alexa AudioPlayer Skills with the Jovo Framework", "activeSections": ["platforms", "alexa", "alexa_audioplayer"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms",
"Amazon Alexa": "docs/amazon-alexa", "AudioPlayer": "" }, "commentsID": "framework/docs/amazon-alexa/audioplayer",
"route": "docs/amazon-alexa/audioplayer" }-->
