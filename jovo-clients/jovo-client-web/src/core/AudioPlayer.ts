import { AudioPlayerEvents, Base64Converter, CoreComponent } from '..';

export class AudioPlayer extends CoreComponent {
	readonly name = 'AudioPlayer';
	private $volume = 1.0;
	private audio: HTMLAudioElement | null = null;
	private isAudioPlaying: boolean = false;

	get isPlaying(): boolean {
		return this.isAudioPlaying;
	}

	get volume(): number {
		return this.$volume;
	}

	set volume(value: number) {
		this.$volume = value;
		if (this.audio) {
			this.audio.volume = value;
		}
	}

	init() {
		const audio = new Audio('');

		audio.play().then(() => {
			audio.pause();
		});

		audio.onended = () => {
			this.isAudioPlaying = false;
			this.$client.emit(AudioPlayerEvents.End);
		};
		this.audio = audio;
	}

	resume() {
		if (this.audio && !this.audio.ended && this.audio.paused) {
			this.audio.play().then(() => {
				this.isAudioPlaying = true;
				this.$client.emit(AudioPlayerEvents.Resume);
			});
		}
	}

	pause() {
		if (this.audio && !this.audio.paused && !this.audio.ended) {
			this.audio.pause();
			this.isAudioPlaying = false;
			this.$client.emit(AudioPlayerEvents.Pause);
		}
	}

	stop() {
		if (this.audio && !this.audio.ended) {
			this.audio.pause();
			this.audio.currentTime = 0;
			this.isAudioPlaying = false;
			this.$client.emit(AudioPlayerEvents.Stop);
		}
	}

	async play(audioSource: string, contentType = 'audio/mpeg'): Promise<void> {
		if (!this.audio) {
			throw new Error('The AudioPlayer has to be initialized before being able to play audio.');
		}
		if (!audioSource.startsWith('https://')) {
			const blob = await Base64Converter.base64ToBlob(audioSource, contentType);
			audioSource = URL.createObjectURL(blob);
		}

		this.audio.src = audioSource;
		await this.audio.play();
		this.isAudioPlaying = true;
		this.$client.emit(AudioPlayerEvents.Play, audioSource);
	}
}
