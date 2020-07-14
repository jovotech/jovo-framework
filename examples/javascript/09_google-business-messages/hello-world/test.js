const {HttpService} = require('jovo-core');

HttpService.post("https://webhook.jovo.cloud/kaan", {
  "agent": "brands/BRAND_ID/agents/AGENT_ID",
  "conversationId": "CONVERSATION_ID",
  "customAgentId": "CUSTOM_AGENT_ID",
  "requestId": "REQUEST_ID",
  "message": {
    "messageId": "MESSAGE_ID",
    "name": "conversations/CONVERSATION_ID/messages/MESSAGE_ID",
    "text": "my name is max",
    "createTime": "MESSAGE_CREATE_TIME"
  },
  "context": {
    "entryPoint": "CONVERSATION_ENTRYPOINT",
    "placeId": "LOCATION_PLACE_ID",
    "userInfo": {
      "displayName": "USER_NAME"
    }
  },
  "sendTime": "SEND_TIME"
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});