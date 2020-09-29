import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.ask('list?');
		//return this.toIntent('ListIntent');
		// return this.toIntent('CarouselIntent');
		// return this.toIntent('CarouselBrowseWeblinksIntent');
		// return this.toIntent('CarouselBrowseAmpIntent');
		// return this.toIntent('CollectionIntent');
		// return this.toIntent('ListIntent');

		// this.tell('run jovo run');
	},

	Unhandled() {
		return this.ask('list unhandled?');
	},
	CollectionIntent() {
		this.$googleAction!.addTypeOverrides([
			{
				name: 'prompt_option',
				mode: 'TYPE_REPLACE',
				synonym: {
					entries: [
						{
							name: 'ITEM_1',
							synonyms: ['Item 1', 'First item'],
							display: {
								title: 'Collection Item #1',
								description: 'Description of Collection Item #1',
								image: {
									alt: 'Google Assistant logo',
									height: 0,
									url:
										'https://developers.google.com/assistant/assistant_96.png',
									width: 0,
								},
							},
						},
						{
							name: 'ITEM_2',
							synonyms: ['Item 2', 'Second item'],
							display: {
								title: 'Collection Item #2',
								description: 'Description of Collection Item #2',
								image: {
									alt: 'Google Assistant logo',
									height: 0,
									url:
										'https://developers.google.com/assistant/assistant_96.png',
									width: 0,
								},
							},
						},
					],
				},
			},
		]);

		this.$googleAction!.addCollection({
			items: [
				{
					key: 'ITEM_1',
				},
				{
					key: 'ITEM_2',
				},
			],
			subtitle: 'List subtitle',
			title: 'List title',
		});
		this.ask('Please select an item');
	},

	ListIntent() {
		this.$googleAction!.addTypeOverrides([
			{
				name: 'prompt_option',
				mode: 'TYPE_REPLACE',
				synonym: {
					entries: [
						{
							name: 'ITEM_1',
							synonyms: ['Item 1', 'First item'],
							display: {
								title: 'Item #1',
								description: 'Description of Item #1',
								image: {
									alt: 'Google Assistant logo',
									height: 0,
									url:
										'https://developers.google.com/assistant/assistant_96.png',
									width: 0,
								},
							},
						},
						{
							name: 'ITEM_2',
							synonyms: ['Item 2', 'Second item'],
							display: {
								title: 'Item #2',
								description: 'Description of Item #2',
								image: {
									alt: 'Google Assistant logo',
									height: 0,
									url:
										'https://developers.google.com/assistant/assistant_96.png',
									width: 0,
								},
							},
						},
					],
				},
			},
		]);

		this.$googleAction!.addList({
			items: [
				{
					key: 'ITEM_1',
				},
				{
					key: 'ITEM_2',
				},
			],
			subtitle: 'List subtitle',
			title: 'List title',
		});
		this.ask('Please select an item');
	},
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
