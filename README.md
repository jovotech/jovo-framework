#The process to commit to the changes in the repository
#Made few changes below



# Jovo Framework: The React for Voice and Chat Apps

> [**NEWS**: We just launched Jovo v4](https://www.jovo.tech/news/jovo-v4)

[![Jovo Framework](https://www.jovo.tech/img/github-header.png)](https://www.jovo.tech)

<p>
<a href="https://www.jovo.tech" target="_blank">Website</a> -  <a href="https://www.jovo.tech/docs" target="_blank">Docs</a> - <a href="https://www.jovo.tech/marketplace" target="_blank">Marketplace</a> - <a href="https://github.com/jovotech/jovo-v4-template" target="_blank">Template</a>   
</p>

<p>
<a href="https://www.npmjs.com/package/@jovotech/framework" target="_blank"><img src="https://badge.fury.io/js/@jovotech%2Fframework.svg"></a>      
<a href="./.github/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://opencollective.com/jovo-framework" target="_blank"><img src="https://opencollective.com/jovo-framework/tiers/badge.svg"></a>
<a href="https://twitter.com/intent/tweet?text=Jovo Framework: The React for Voice and Chat Apps @jovotech https://github.com/jovotech/jovo-framework/" target="_blank"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>
</p>

Build conversational and multimodal experiences for the web, Alexa, Google Assistant, Messenger, Instagram, Google Business Messages, mobile apps, and more. Fully customizable and open source. Works with TypeScript and JavaScript.

```typescript
@Component()
export class LoveHatePizzaComponent extends BaseComponent {
  START() {
    return this.$send(YesNoOutput, { message: 'Do you like pizza?' });
  }

  @Intents(['YesIntent'])
  lovesPizza() {
    return this.$send({ message: 'Yes! I love pizza, too.', listen: false });
  }

  @Intents(['NoIntent'])
  hatesPizza() {
    return this.$send({ message: `That's OK! Not everyone likes pizza.`, listen: false });
  }
}
```

- **Cross-platform**: Works on the [web](https://www.jovo.tech/marketplace/platform-web), voice platforms (like [Alexa](https://www.jovo.tech/marketplace/platform-alexa) and [Google Assistant](https://www.jovo.tech/marketplace/platform-googleassistant)), and chat platforms (like [Facebook Messenger](https://www.jovo.tech/marketplace/platform-facebookmessenger), [Instagram](https://www.jovo.tech/marketplace/platform-instagram), and [Google Business Messages](https://www.jovo.tech/marketplace/platform-googlebusiness)).
- **Fast**: A [CLI](https://www.jovo.tech/docs/cli), local development, and browser-based debugging using the [Jovo Debugger](https://www.jovo.tech/docs/debugger).
- **Component-based**: Build robust experiences based on reusable components.
- **Multimodal**: An [output template](https://www.jovo.tech/docs/output-templates) engine that translates structured content into voice, text, and visual responses.
- **Extensible**: Build [Framework plugins](https://www.jovo.tech/docs/plugins), [CLI plugins](https://www.jovo.tech/docs/cli-plugins), and leverage many integrations from the [Jovo Marketplace](https://www.jovo.tech/marketplace).
- **Integrated**: Works with many [NLU](https://www.jovo.tech/docs/nlu) and [CMS](https://www.jovo.tech/docs/cms) services.
- **Robust**: Includes [staging](https://www.jovo.tech/docs/staging) and a [unit testing suite](https://www.jovo.tech/docs/unit-testing).

## Getting Started

> Learn more in our [Getting Started Guide](https://www.jovo.tech/docs/getting-started).

Install the Jovo CLI:

```sh
$ npm install -g @jovotech/cli
```

Create a new Jovo project ([find the v4 template here](https://github.com/jovotech/jovo-v4-template)):

```sh
$ jovo new <directory>
```

Go into project directory and run the Jovo development server:

```sh
# Go into project directory (replace <directory> with your folder)
$ cd <directory>

# Run local development server
$ jovo run

# Press "." to open the Jovo Debugger
```

## Sponsors

We're glad to be supported by respected companies and individuals in the voice-first and conversational AI industry. [See our Open Collective to learn more](https://opencollective.com/jovo-framework).

**Gold Sponsors**

<a href="https://opencollective.com/jovo-framework#section-contributors"><img src="https://opencollective.com/jovo-framework/tiers/gold-sponsors.svg?avatarHeight=50&width=600" /></a>

**Silver Sponsors**

<a href="https://opencollective.com/jovo-framework#section-contributors"><img src="https://opencollective.com/jovo-framework/tiers/silver-sponsors.svg?avatarHeight=50&width=600" /></a>

**Bronze Sponsors**

<a href="https://opencollective.com/jovo-framework#section-contributors"><img src="https://opencollective.com/jovo-framework/tiers/bronze-sponsors.svg?avatarHeight=35&width=600" /></a>

Find all supporters in our [`BACKERS.md`](./BACKERS.md) file.

> [Support Jovo on Open Collective](https://opencollective.com/jovo-framework)
