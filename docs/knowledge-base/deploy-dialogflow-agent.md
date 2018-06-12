# Deploy a Dialogflow Agent with the Jovo CLI

## Generate Keyfile

For detailed instructions, take a look at this blog post: https://www.jovo.tech/blog/deploy-dialogflow-agent-jovo-cli/

## Add content to app.json

```js
"googleAction": {
  "dialogflow": {
    "projectId": "<your-project-id>",
    "keyFile": "<path-to-key-file>"
    }
}
```

## Build and deploy

```sh
# Build platform-specific files
$ jovo build

# Deploy to Dialogflow
$ jovo deploy
```


<!--[metadata]: {"title": "Deploy a Dialogflow Agent with the Jovo CLI", 
                "description": "Learn more about workflows you can use with the Jovo CLI for Alexa Skills and Google Actions.",
                "activeSections": ["kb", "cli_workflows"],
                "expandedSections": "kb",
                "inSections": "kb",
                "breadCrumbs": {"Docs": "docs",
				"Knowledge Base": "docs/kb"
                                },
		"commentsID": "framework/docs/kb/deploy-dialogflow-agent",
		"route": "docs/kb/deploy-dialogflow-agent"
                }-->
