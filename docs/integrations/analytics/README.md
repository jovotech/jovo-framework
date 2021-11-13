# Analytics

Jovo offers easy analytics integrations and enhancements for Dashbot, Bespoken, Chatbase, and Botanalytics.

- [Jovo Analytics Interface](#jovo-analytics-interface)
- [Available Integrations](#available-integrations)

## Jovo Analytics Interface

Jovo offers an abstraction layer for analytics integrations that allows you to add multiple analytics providers.

Analytics for your voice app can be added in your `config.js` file like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	analytics: {
		ServiceName: {
			// Add configuration
		},
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	analytics: {
		ServiceName: {
			// Add configuration
		},
	},

	// ...
};
```

More detailed step-by-step guides for each service can be found in the [Available Integrations](#available-integrations) section.

## Available Integrations

| Name                                                                               | Description              |
| ---------------------------------------------------------------------------------- | ------------------------ |
| [Botanalytics](https://v3.jovo.tech/marketplace/jovo-analytics-botanalytics)       | Conversational Analytics |
| [Chatbase](https://v3.jovo.tech/marketplace/jovo-analytics-chatbase)               | Virtual Agent Analytics  |
| [Dashbot](https://v3.jovo.tech/marketplace/jovo-analytics-dashbot)                 | Conversational Analytics |
| [GoogleAnalytics](https://v3.jovo.tech/marketplace/jovo-analytics-googleanalytics) | GoogleAnalytics          |

<!--[metadata]: {"description": "Analytics for Alexa Skills and Google Actions with Jovo Integrations",
"route": "analytics" }-->
