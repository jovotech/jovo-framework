# Deploy a Dialogflow Agent with the Jovo CLI

Learn how to deploy modify your app.json so to be able update your Dialogflow Agent without having to leave the command line.

* [Generate Keyfile](#generate-keyfile)
* [Add content to app.json](#add-content-to-appjson)
* [Build and deploy](#build-and-deploy)

Watch the video here:

[![Video: Deploy a Dialogflow Agent with the Jovo CLI](../img/video-deploy-dialogflow-agent.jpg "youtube-video")](https://www.youtube.com/watch?v=040dIi8Z6bk)

## Generate Keyfile

For detailed instructions, take a look at this blog post: https://www.jovo.tech/blog/deploy-dialogflow-agent-jovo-cli/

## Add content to app.json

In you `app.json`, you need to add both the `projectId` of your Dialogflow agent and the path to the `keyFile`:

```js
"googleAction": {
  "dialogflow": {
    "projectId": "<your-project-id>",
    "keyFile": "<path-to-key-file>"
    }
}
```

## Build and deploy

Use `jovo build` to create platform specifiy files and then `jovo deploy` to update your agent:

```sh
# Build platform-specific files
$ jovo build

# Deploy to Dialogflow
$ jovo deploy
```


<!--[metadata]: {"title": "Deploy a Dialogflow Agent with the Jovo CLI", 
                "description": "Learn how to deploy a Dialogflow agent from the command line with the Jovo CLI",
                "activeSections": ["kb"],
                "expandedSections": "kb",
                "inSections": "kb",
                "breadCrumbs": {"Docs": "docs",
				"Knowledge Base": "docs/kb"
                                },
		"commentsID": "framework/docs/kb/deploy-dialogflow-agent",
		"route": "docs/kb/deploy-dialogflow-agent"
                }-->
