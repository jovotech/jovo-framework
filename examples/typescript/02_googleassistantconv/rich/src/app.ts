import { App, SpeechBuilder } from 'jovo-framework';

import { GoogleAssistant, BasicCard } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('BasicCardIntent');
		// return this.toIntent('ImageCardIntent');
		// return this.toIntent('TableIntent');
		// return this.toIntent('SuggestionsIntent');
		// return this.toIntent('RichIntent');
		// return this.toIntent('RichIntentEndConversation');
	},
	BasicCardIntent() {

		this.$googleAction!.showBasicCard({
			title: 'Title',
			subtitle: 'Subtitle',
			text: 'Text',
			image: {
				url: 'https://via.placeholder.com/450x350?text=Basic+Card',
				alt: 'Image text',
			},
		});

		// or

		const basicCard = new BasicCard()
			.setTitle('Title')
			.setImage({
				url: 'http://via.placeholder.com/450x350?text=Basic+Card',
				alt: 'accessibilityText'})
			.setText('Formatted Text')
			.setImageDisplay('WHITE');

		this.$googleAction!.showBasicCard(basicCard);

		this.ask('Basic card');
	},
	ImageCardIntent() {
		this.$googleAction!.addImageCard({
			url: 'https://via.placeholder.com/450x350?text=Basic+Card',
			alt: 'Image text',
		});
		this.tell('Image card');
	},
	TableIntent() {
		this.$googleAction!.addTable({
			columns: [
				{
					header: 'Column A',
				},
				{
					header: 'Column B',
				},
				{
					header: 'Column C',
				},
			],
			image: {
				alt: 'Google Assistant logo',
				height: 0,
				url: 'https://developers.google.com/assistant/assistant_96.png',
				width: 0,
			},
			rows: [
				{
					cells: [
						{
							text: 'A1',
						},
						{
							text: 'B1',
						},
						{
							text: 'C1',
						},
					],
				},
				{
					cells: [
						{
							text: 'A2',
						},
						{
							text: 'B2',
						},
						{
							text: 'C2',
						},
					],
				},
				{
					cells: [
						{
							text: 'A3',
						},
						{
							text: 'B3',
						},
						{
							text: 'C3',
						},
					],
				},
			],
			subtitle: 'Table Subtitle',
			title: 'Table Title',
		});
		this.tell('Response with table');
	},
	SuggestionsIntent() {
		this.$googleAction!.showSuggestions(['Yes', 'No']);
		this.ask('Say yes or no');
	},
	RichIntent() {
		this.$googleAction!.prompt({
			firstSimple: {
				speech: SpeechBuilder.toSSML('Hello World!'),
				text: `I'm only visible on a smartphone.`,
			},
			content: {
				card: {
					title: 'Title',
					subtitle: 'Subtitle',
					text: 'Text',
					image: {
						url: 'https://via.placeholder.com/450x350?text=Basic+Card',
						alt: 'Image text',
					},
				},
			},
			lastSimple: {
				speech: SpeechBuilder.toSSML('Say yes or no'),
				text: `Choose wisely. I'm also only visible on a smartphone`,
			},
			suggestions: [
				// suggestions work only for sessions that kept open
				{
					title: 'Yes',
				},
				{
					title: 'No',
				},
			],
		});
	},
	RichIntentEndConversation() {
		this.$googleAction!.prompt({
			firstSimple: {
				speech: SpeechBuilder.toSSML('Hello World!'),
				text: `I'm only visible on a smartphone.`,
			},
			content: {
				card: {
					title: 'Title',
					subtitle: 'Subtitle',
					text: 'Text',
					image: {
						url: 'https://via.placeholder.com/450x350?text=Basic+Card',
						alt: 'Image text',
					},
				},
			},
		});
		this.$googleAction!.endConversation();
	},
});

export { app };
