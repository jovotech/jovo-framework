# Audio Player Skills

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-alexa/interfaces/audio-player

AudioPlayer Skills can be used to stream long-form audio files like music or podcasts. The audio file must be hosted at an Internet-accessible HTTPS endpoint. The supported formats for the audio file include AAC/MP4, MP3, and HLS. Bitrates: 16kbps to 384 kbps. More information can be found here at the [official reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference).

Get started by creating a new Jovo project with the [`alexa-audioplayer`](https://github.com/jovotech/jovo-templates/tree/master/alexa/audioplayer) template:

```text
$ jovo3 new <directory> --template alexa-audioplayer
```

* [Configuration](#configuration)
* [Audio Player Features](#audio-player-features)
  * [Play](#play)
  * [Enqueue](#enqueue)
  * [Stop](#stop)
  * [Start Over](#start-over)
  * [Clear Queue](#clear-queue)
  * [Set Track Metadata](#set-track-metadata)
* [Audio Player Directives](#audio-player-directives)
* [Playback Controller](#playback-controller)

## Configuration

To be able to use the Alexa AudioPlayer, you need to enable the AudioPlayer interface for your Alexa Skill Project. 

The [`alexa-audioplayer`](https://github.com/jovotech/jovo-templates/tree/master/alexa/audioplayer) template already comes with the right configuration in its `project.js` file:

```javascript
// project.js

alexaSkill: {
    nlu: 'alexa',
    manifest: {
        apis: {
            custom: {
                interfaces: [
                    {
                        type: 'AUDIO_PLAYER'
                    }
                ]
            }
        }
    }
},
```

This will write the necessary information into the `skill.json` and deploy it to your Alexa Skill project with the following commands:

```sh
# Build Alexa specific files into platforms folder
$ jovo3 build

# Deploy to Alexa Developer Console
$ jovo3 deploy
```

Alternatively, you can also go to the Alexa Developer Console and enable AudioPlayer in the interfaces tab:

![Alexa Console: Enable Audio Player Interface](../../img/alexa-enable-audioplayer-interface.jpg)

## Audio Player Features

### Play
Play a file.
Speech will take place before the file begins to play.

play(url, token, playBehavior)

```javascript
// @language=javascript

// Start playing a file from the beginning
this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
    .play(url, token)
    .tell(speech);

// or for example playing with an offset.
const offset = 3000;
this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(offset)
    .play(url, token)
    .tell(speech);

// or specify PlayBehavior
this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
.play(url,token,'ENQUEUE')
.tell(speech)

// @language=typescript

// Start playing a file from the beginning
this.$alexaSkill!.$audioPlayer.setOffsetInMilliseconds(0)
    .play(url, token)
    .tell(speech);

// or for example playing with an offset.
const offset:number = 3000;
this.$alexaSkill!.$audioPlayer.setOffsetInMilliseconds(offset)
    .play(url, token)
    .tell(speech);

// or specify PlayBehavior
this.$alexaSkill!.$audioPlayer.setOffsetInMilliseconds(0)
.play(url,token,'ENQUEUE')
.tell(speech)
```

Play has the following parameters.

Name | Description | Value | Required
:--- | :--- | :--- | :---
`url` | Specify the URL source of your audio must be HTTPS | `String` | YES |
`token` | An opaque token that represents the audio stream. This token cannot exceed 1024 characters. | `String` | YES |
`PlayBehavior` | Describes playback behavior. Accepted values: <br/> `REPLACE_ALL`: Immediately begin playback of the specified stream, and replace current and enqueued streams.<br/> `ENQUEUE`: Add the specified stream to the end of the current queue. This does not impact the currently playing stream. <br/>`REPLACE_ENQUEUED`: Replace all streams in the queue. This does not impact the currently playing stream. | `String` | NO - Defaults to REPLACE_ALL |

### Enqueue

Adds specified audio file to the queue. Remember that the URL must be HTTPS.

```javascript
// @language=javascript

this.$alexaSkill.$audioPlayer.setExpectedPreviousToken(expectedToken).enqueue(url, token)

// @language=typescript

this.$alexaSkill!.$audioPlayer.setExpectedPreviousToken(expectedToken).enqueue(url, token)
```

Name | Description | Value | Required
:--- | :--- | :--- | :---
`expectedToken` | token of the currently playing stream | `String` | YES |
`url` | Specify the URL source of your audio must be HTTPS | `String` |  YES |
`token` | An opaque token that represents the audio stream. This token cannot exceed 1024 characters. | `String` | YES |    

### Stop

Stops the current file from playing.

```javascript
// @language=javascript

this.$alexaSkill.$audioPlayer.stop();

// @language=typescript

this.$alexaSkill!.$audioPlayer.stop();
```

### Start Over

Starts the file specified by the url from the beginning.

```javascript
// @language=javascript

this.$alexaSkill.$audioPlayer.startOver(url, token);

// @language=typescript

this.$alexaSkill!.$audioPlayer.startOver(url, token);
```

Name | Description | Value | Required
:--- | :--- | :--- | :---
`url` | Specify the URL source of your audio must be HTTPS | `String` |  YES |
`token` | An opaque token that represents the audio stream. This token cannot exceed 1024 characters. | `String` | YES |    

### Clear Queue

Use to clear all the queue or just the enqueue files.

```javascript
// @language=javascript

this.$alexaSkill.$audioPlayer.clearQueue('CLEAR_ALL');

// @language=typescript

this.$alexaSkill!.$audioPlayer.clearQueue('CLEAR_ALL');
```

Name | Description | Value | Required
:--- | :--- | :--- | :---
`clearBehavior` | `CLEAR_ALL` - to clear everything <br/>  `CLEAR_ENQUEUED`- to clear just the queue. | `String` | YES |

### Set Track Metadata

You can set track metadata that is used to show additional information for Alexa devices with a screen. Learn more about Audioplayer displays in the [official reference by Amazon](https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#audioplayer-display).

Name | Description | Value | Required
:--- | :--- | :--- | :---
`title` | The title text to display | `String` | NO |
`subtitle` | Subtitle to display | `String` | NO |
`artwork` | URL for the image to display | `String` | NO
`background` | URL for the background image to display | `STRING` | NO

```javascript
// @language=javascript

this.$alexaSkill.$audioPlayer
    .setTitle('First Track')
    .setSubtitle('A simple subtitle')
    .addArtwork('https://www.somewhere.com/image.png')
    .addBackgroundImage('https://www.somewhere.com/background.jpg')
    // The above method calls need to be before play()
    .play(url, token);
    
// @language=typescript

this.$alexaSkill!.$audioPlayer
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


## Audio Player Directives

Add the following to your handlers variable:

```javascript
// @language=javascript
// src/app.js

app.setHandler({

    // Other intents

    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {
            console.log('AlexaSkill.PlaybackStarted');
        },

        'AlexaSkill.PlaybackNearlyFinished'() {
            console.log('AlexaSkill.PlaybackNearlyFinished');
        },

        'AlexaSkill.PlaybackFinished'() {
            console.log('AlexaSkill.PlaybackFinished');
        },

        'AlexaSkill.PlaybackStopped'() {
            console.log('AlexaSkill.PlaybackStopped');
        },
        
        'AlexaSkill.PlaybackFailed'() {
            console.log('AlexaSkill.PlaybackFailed');
        },

    },

});

// @language=typescript
// src/app.ts

app.setHandler({

    // Other intents

    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {
            console.log('AlexaSkill.PlaybackStarted');
        },

        'AlexaSkill.PlaybackNearlyFinished'() {
            console.log('AlexaSkill.PlaybackNearlyFinished');
        },

        'AlexaSkill.PlaybackFinished'() {
            console.log('AlexaSkill.PlaybackFinished');
        },

        'AlexaSkill.PlaybackStopped'() {
            console.log('AlexaSkill.PlaybackStopped');
        },
        
        'AlexaSkill.PlaybackFailed'() {
            console.log('AlexaSkill.PlaybackFailed');
        },

    },

});
```

## Playback Controller

`PlaybackController` requests are used to notify you about user interactions with audio player controls, e.g. touch controls on Alexa-enabled devices.

All these requests are mapped to built-in intents inside the `PLAYBACKCONTROLLER` state. You can respond to them with `AudioPlayer` directives, e.g. `play`, `pause`, etc.

```javascript
PLAYBACKCONTROLLER: {
    'PlayCommandIssued'() {
        console.log('PlaybackController.PlayCommandIssued');
    },

    'NextCommandIssued'() {
        console.log('PlaybackController.NextCommandIssued');
    },

    'PreviousCommandIssued'() {
        console.log('PlaybackController.PreviousCommandIssued');
    },

    'PauseCommandIssued'() {
        console.log('PlaybackController.PauseCommandIssued');
    }
},
```