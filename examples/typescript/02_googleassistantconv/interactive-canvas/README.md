

## Usage (Local development)

Run the express server with the static HTML content. (Runs on port 3001)
```shell script
> npm run webapp
```

Make the server accessable (via ngrok)
```shell script
> ngrok http 3001
```

Use public endpoint url in `htmlResponse(obj)`
```javascript
this.$googleAction.htmlResponse({
    url: '<ngrok-url>'
});
```
