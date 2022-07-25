export default {
  name: 'translation',
  title: 'Translation',
  type: 'document',
  fields: [
    {
      name: 'key',
      title: 'Key',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'defaultEntry',
      title: 'Default',
      type: 'translationEntry',
      validation: Rule => Rule.required(),
    },
    {
      name: 'additionalEntries',
      title: 'Additional Translations',
      type: 'array',
      of: [{ type: 'translationEntry' }],
      validation: Rule => Rule.unique()
    }
  ],

  preview: {
    select: {
      key: 'key',
      defaultEntry: 'defaultEntry'
    },
    prepare(selection) {
      const { key, defaultEntry } = selection
      return Object.assign({}, selection, {
        title: defaultEntry.platform ? `${key} (${defaultEntry.locale}:${defaultEntry.platform})` : `${key} (${defaultEntry.locale})`,
        subtitle: defaultEntry.text,
      })
    },
  },
}
