# Bixby AudioPlayer

Learn more about how to use the Bixby AudioPlayer functionality.

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Play](#play)
  - [Enqueue](#enqueue)
  - [Meta Data](#meta-data)

## Introduction

The AudioPlayer functionality can be used to stream any number of audio files, such as music or podcasts.

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

![Training Example](../../img/bixby-training-audio.png 'This is how an example utterance in the training tool looks like.')

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

// Play audio file from url with specified format (e.g. audio/mp3)
this.$bixbyCapsule.$audioPlayer.play({ url, format });

// You can optionally specify a token and an offset in ms
this.$bixbyCapsule.$audioPlayer.play({
	url,
	format,
	token,
	offsetInMilliseconds
});

// Alternative function headers
this.$bixbyCapsule.$audioPlayer.setAudioStream({ url, format });

// @language=typescript

// Play audio file from url with specified format (e.g. audio/mp3)
this.$bixbyCapsule!.$audioPlayer!.play({ url, format });

// You can optionally specify a token and an offset in ms
this.$bixbyCapsule!.$audioPlayer!.play({
	url,
	format,
	token,
	offsetInMilliseconds
});

// Alternative function headers
this.$bixbyCapsule!.$audioPlayer!.setAudioStream({ url, format });
```

### Enqueue

```javascript
// @language=javascript

// Enqueue an audio stream into an existing playlist.
this.$bixbyCapsule.$audioPlayer.enqueue({ url, format });

// You can optionally specify a token and an offset in ms.
this.$bixbyCapsule.$audioPlayer.enqueue({
	url,
	format,
	token,
	offsetInMilliseconds
});

// Alternative function headers
this.$bixbyCapsule.$audioPlayer.addAudioStream({ url, format });

// You can also add an array of audio items.
this.$bixbyCapsule.$audioPlayer.addAudioStreams([
	{ url1, format },
	{ url2, format }
]);

// @language=typescript

// Enqueue an audio stream into an existing playlist.
this.$bixbyCapsule!.$audioPlayer!.enqueue({ url, format });

// You can optionally specify a token and an offset in ms.
this.$bixbyCapsule!.$audioPlayer!.enqueue({
	url,
	format,
	token,
	offsetInMilliseconds
});

// Alternative function headers
this.$bixbyCapsule!.$audioPlayer!.addAudioStream({ url, format });

// You can also add an array of audio items.
this.$bixbyCapsule!.$audioPlayer!.addAudioStreams([
	{ url1, format },
	{ url2, format }
]);
```

### Meta Data

```javascript
// @language=javascript

// Set the display name
this.$bixbyCapsule.$audioPlayer.setDisplayName(displayName);

// Set whether to wait for TTS to finish, before playing audio. Default is true.
this.$bixbyCapsule.$audioPlayer.waitForTTS(false);

// Or
this.$bixbyCapsule.$audioPlayer.setDoNotWaitForTTS(true);

// If you have multiple audio items in the queue, you can specify a starting index, on which audio file the audioplayer is going to start
this.$bixbyCapsule.$audioPlayer.setStartAudioItemIndex(index);

// Sets an id for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setId(id);

// Sets a title for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setTitle(title);

// Sets subtitles for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setSubtitle(subtitle);

// Sets the artist for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setArtist(artist);

// Sets the album art for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setAlbumArt(url);

// Sets an album name for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setAlbumName(name);

// Sets a duration for the audio item containing your audio streams
this.$bixbyCapsule.$audioPlayer.setDuration(duration);

// You can also choose to set the whole audio item with it's metadata and audio streams
this.$bixbyCapsule.$audioPlayer.setMetaData({
	albumArtUrl,
	albumName,
	artist,
	duration,
	id,
	stream,
	subtitle,
	title,
});

// @language=typescript

// Set the display name
this.$bixbyCapsule!.$audioPlayer!.setDisplayName(displayName);

// Set whether to wait for TTS to finish, before playing audio. Default is true.
this.$bixbyCapsule!.$audioPlayer!.waitForTTS(false);

// Or
this.$bixbyCapsule!.$audioPlayer!.setDoNotWaitForTTS(true);

// If you have multiple audio items in the queue, you can specify a starting index, on which audio file the audioplayer is going to start
this.$bixbyCapsule!.$audioPlayer!.setStartAudioItemIndex(index);

// Sets an id for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setId(id);

// Sets a title for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setTitle(title);

// Sets subtitles for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setSubtitle(subtitle);

// Sets the artist for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setArtist(artist);

// Sets the album art for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setAlbumArt(url);

// Sets an album name for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setAlbumName(name);

// Sets a duration for the audio item containing your audio streams
this.$bixbyCapsule!.$audioPlayer!.setDuration(duration);

// You can also choose to set the whole audio item with it's metadata and audio streams
this.$bixbyCapsule!.$audioPlayer!.setMetaData({
	albumArtUrl,
	albumName,
	artist,
	duration,
	id,
	stream,
	subtitle,
	title,
});
```

<!--[metadata]: {"description": "Learn more about how to use the Bixby AudioPlayer functionality.",
"route": "samsung-bixby/audioplayer" }-->
