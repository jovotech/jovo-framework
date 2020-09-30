import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		// return this.toIntent('BasicCardIntent');
		// return this.toIntent('TableIntent');
		// return this.toIntent('SuggestionsIntent');
		return this.toIntent('ListIntent');
		// return this.toIntent('CarouselIntent');
		// return this.toIntent('CarouselBrowseWeblinksIntent');
		// return this.toIntent('CarouselBrowseAmpIntent');
	},
	BasicCardIntent() {
		this.$googleAction!.addBasicCard({
			title: 'Title',
			subtitle: 'Subtitle',
			text: 'Text',
			image: {
				url: 'https://via.placeholder.com/450x350?text=Basic+Card',
				alt: 'Image text',
			},
		});
		this.ask('Basic card');
	},
	ImageCardIntent() {
		this.$googleAction!.addImageCard({
			url: 'https://via.placeholder.com/450x350?text=Basic+Card',
			alt: 'Image text',
		});
		this.ask('Image card');
	},
	TableIntent() {
		this.$googleAction!.addTable({
			button: {},
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
		this.ask('Response with table', '?');
	},
	SuggestionsIntent() {},
	ListIntent() {},
	CarouselIntent() {},
	CarouselBrowseWeblinksIntent() {
		this.ask('Click on the link', 'Click on the link');
	},
	CarouselBrowseAmpIntent() {
		this.ask('Click on the link', 'Click on the link');
	},

	ON_ELEMENT_SELECTED() {
		this.tell(this.getSelectedElementId() + ' selected');
	},
});

export { app };
