export default {
  name: 'translationEntry',
  title: 'Translation Entry',
  type: 'object',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'en', value: 'en' },
          { title: 'en-AU', value: 'en-AU' },
          { title: 'en-CA', value: 'en-CA' },
          { title: 'en-GB', value: 'en-GB' },
          { title: 'en-IN', value: 'en-IN' },
          { title: 'en-US', value: 'en-US' },
        ],
      },
    },
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'alexa', value: 'alexa' },
          { title: 'googleAssistant', value: 'googleAssistant' },
        ],
      },
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: Rule => Rule.required(),
    },
  ],

  preview: {
    select: {
      locale: 'locale',
      platform: 'platform',
      text: 'text'
    },
    prepare(selection) {
      const { locale, text, platform } = selection
      return Object.assign({}, selection, {
        title: platform ? `${locale}:${platform}` : locale,
        subtitle: text,
      })
    },
  },
}
