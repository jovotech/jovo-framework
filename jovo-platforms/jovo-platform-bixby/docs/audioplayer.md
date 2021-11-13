# Bixby AudioPlayer

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-bixby/audioplayer

Learn more about how to use the Bixby AudioPlayer functionality.

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Play](#play)
  - [Enqueue](#enqueue)
  - [Meta Data](#meta-data)

## Introduction

The AudioPlayer functionality can be used to stream any number of audio files, such as music or podcasts. 

If you want to start a new AudioPlayer capsule with the intent of using the platform integration with the Jovo Framework, we recommend to start with our Bixby AudioPlayer Template. It comes with a very easy setup for using the AudioPlayer functionality, as well as all the Jovo models required for the integration to work properly. You can download it using the following command:

```sh
$ jovo3 new bixby-hello-world --template bixby-audioplayer
```

## Prerequisites

### Provide AudioPlayer-specific Bixby structures

To use the AudioPlayer functionality for Bixby, you need to add and train on a respective action, which will tell Bixby to expect required parameters to construct an audioplayer element.

Go ahead and add the following action to your `actions/` folder:

```bxb
action (PlayAudioAction) {
  description (Collects audio information on endpoint and should pass it to Jovo.)
  type(Search)

  collect {
    input (_JOVO_PREV_RESPONSE_) {
      type(JovoResponse)
      min (Required)
      max (One)
    }
  }
  output(JovoResponse)
}
```

Now, in your training tool, add a sample utterance for this action. As the goal, enter `JovoPlayAudioAction`, which is a predefined action inside `models/Jovo/actions/`. It uses the `computed-input` functionality and constructs a structure of type `audioPlayer.Result` based on the `_JOVO_AUDIO_` property in `JovoResponse`.

> Learn more about `computed-inputs` [here](https://bixbydevelopers.com/dev/docs/reference/type/action.collect.computed-input).

However, this won't work yet, as Bixby doesn't know where the `JovoResponse` comes from. We need a way of telling Bixby, that the goal is `JovoPlayAudioAction`, but the input property comes from our `PlayAudioAction` we just created. Fortunately, there is a way to achieve this. When editing the training phrase inside the training tool, there is a little grey bar on the left side of the input field. When you click on that, a new window appears, which allows you to create a route for your utterance, specifying what route to take when this utterance is triggered to achieve the desired goal.

![Training Example](../img/bixby-training-audio.png 'This is how an example utterance in the training tool looks like.')

### Add a directive to your handler

As soon as your audio response is being handled by Bixby, it sends out a directive to your voice app, indicating that audio is about to be played. You must register that directive in your handler. If you want to return a response before the audio is being played, you need to do that in the directive.

```js
// @language=javascript

// app.js

app.setHandler({
	// Handler logic

	AUDIOPLAYER: {
		'BixbyCapsule.AudioPlaying'() {
			console.log('BixbyCapsule.AudioPlaying');

			this.tell('Playing audio.');
		}
	}
});

// @language=typescript

// app.ts

app.setHandler({
	// Handler logic

	AUDIOPLAYER: {
		'BixbyCapsule.AudioPlaying'() {
			console.log('BixbyCapsule.AudioPlaying');

			this.tell('Playing audio.');
		}
	}
});
```

The last thing you need to do is to register that directive inside your `endpoints.bxb` file.

```bxb
// endpoints.bxb

endpoints {
  action-endpoints {
	// Endpoints

    action-endpoint (JovoPlayAudioAction) {
      remote-endpoint ("{remote.url}?directive=AudioPlaying") {
        method (POST)
      }
    }
  }
}
```

## Usage

Now that your capsule is ready for the AudioPlayer functionality, you can start using it in your code.

You can access the plugin like this:

```javascript
// @language=javascript

this.$bixbyCapsule.$audioPlayer

// @language=typescript

this.$bixbyCapsule!.$audioPlayer!
```

### Play

```javascript
// @language=javascript

// Play a single audio file from url with specified format (e.g. audio/mp3)
this.$bixbyCapsule.$audioPlayer.play({ stream: { url } });

// You can optionally specify the following properties. If not given, default values will be used.
this.$bixbyCapsule.$audioPlayer.play({
	id,
	stream: { url, format },
	title,
	subtitle,
	artist,
	albumArtUrl,
	duration,
	albumName
});

// Alternative function headers
this.$bixbyCapsule.$audioPlayer.setAudioStream({ stream: { url } });

// @language=typescript

// Play a single audio file from url with specified format (e.g. audio/mp3)
this.$bixbyCapsule!.$audioPlayer!.play({ stream: { url } });

// You can optionally specify the following properties. If not given, default values will be used.
this.$bixbyCapsule!.$audioPlayer!.play({
	id,
	stream: { url, format },
	title,
	subtitle,
	artist,
	albumArtUrl,
	duration,
	albumName
});

// Alternative function headers
this.$bixbyCapsule!.$audioPlayer!.setAudioStream({ stream: { url } });
```

### Enqueue

```javascript
// @language=javascript

// Enqueue an audio stream into an existing playlist.
this.$bixbyCapsule.$audioPlayer.enqueue({ stream: { url } });

// You can optionally specify the following properties. If not given, default values will be used.
this.$bixbyCapsule.$audioPlayer.enqueue({
	id,
	stream: { url, format },
	title,
	subtitle,
	artist,
	albumArtUrl,
	duration,
	albumName
});

// Alternative function headers
this.$bixbyCapsule.$audioPlayer.addAudioStream({ stream: { url } });

// You can also add an array of audio items.
this.$bixbyCapsule.$audioPlayer.addAudioStreams([
	{ stream: { url1 } },
	{ stream: { url2 } },
]);

// @language=typescript

// Enqueue an audio stream into an existing playlist.
this.$bixbyCapsule!.$audioPlayer!.enqueue({ stream: { url } });

// You can optionally specify the following properties. If not given, default values will be used.
this.$bixbyCapsule!.$audioPlayer!.enqueue({
	id,
	stream: { url, format },
	title,
	subtitle,
	artist,
	albumArtUrl,
	duration,
	albumName
});

// Alternative function headers
this.$bixbyCapsule!.$audioPlayer!.addAudioStream({ stream: { url } });

// You can also add an array of audio items.
this.$bixbyCapsule!.$audioPlayer!.addAudioStreams([
	{ stream: { url1 } },
	{ stream: { url2 } },
]);
```

### Meta Data

```javascript
// @language=javascript

// Set the display name.
this.$bixbyCapsule.$audioPlayer.setDisplayName(displayName);

// Set whether to wait for TTS to finish, before playing audio. Default is true.
this.$bixbyCapsule.$audioPlayer.waitForTTS(false);

// Or
this.$bixbyCapsule.$audioPlayer.setDoNotWaitForTTS(true);

// If you have multiple audio items in the queue, you can specify a starting index, on which audio file the audioplayer is going to start
this.$bixbyCapsule.$audioPlayer.setStartAudioItemIndex(index);

// Set a repeat mode for your playlist. Possible values include OFF, ALL and NONE.
this.$bixbyCapsule.$audioPlayer.setRepeatMode(mode);

// @language=typescript

// Set the display name
this.$bixbyCapsule!.$audioPlayer!.setDisplayName(displayName);

// Set whether to wait for TTS to finish, before playing audio. Default is true.
this.$bixbyCapsule!.$audioPlayer!.waitForTTS(false);

// Or
this.$bixbyCapsule!.$audioPlayer!.setDoNotWaitForTTS(true);

// If you have multiple audio items in the queue, you can specify a starting index, on which audio file the audioplayer is going to start
this.$bixbyCapsule!.$audioPlayer!.setStartAudioItemIndex(index);

// Set a repeat mode for your playlist. Possible values include OFF, ALL and NONE.
this.$bixbyCapsule!.$audioPlayer!.setRepeatMode(mode);
```