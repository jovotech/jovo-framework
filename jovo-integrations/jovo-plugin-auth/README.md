# Jovo Auth Integration

Installation:
```sh
npm install jovo-plugin-auth
```

Usage in the app:
```
const { ApiKey } = require('jovo-plugin-auth');

app.use(
    new ApiKey({
        'x-api-key': 'foobar'          
    })
);
```

There are two ways to pass the key to the app:

Via header object

```
{
    'x-api-key': 'foobar'
}
```

Via query param
```
https://endpoint.example.com/user?x-api-key=foobar
```


Customization:
If you want to pass your custom api key variable name, use `customKeyName` and `customKeyValue`


```
const { ApiKey } = require('jovo-plugin-auth');

app.use(
    new ApiKey({
        'customKeyName': 'apiKey'          
        'customKeyValue': 'foobar'          
    })
);
```




