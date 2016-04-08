# Kanye Alexa Skill

An Alexa skill for the Amazon Echo. It reads Kanye's tweets using the [Twitter API](https://dev.twitter.com). Generated using [generator-alexa-skill](https://github.com/cameronhunter/generator-alexa-skill).

## Example phrases
```
Alexa, ask Kanye what's up
Alexa, ask Kanye what's happenin
```

See `model/UTTERANCES` for more example phrases.

## Development

### Setup
You must add a file `config/twitter.config.js` which exports an object containing your API keys for the Twitter API.

```javascript
export default {
  consumerKey: '',
  consumerSecret: '',
  accessToken: '',
  accessTokenSecret: ''
}
```

### Test

```bash
npm test
```

### Deploy

```bash
npm run deploy
```

This creates `build/package.zip` containing the compiled skill exposing a single function `index.handler`. This package is then deployed to AWS Lambda. You can check it out in the [AWS console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/alexa-skill-test). Example utterances are also expanded and output to `build/UTTERANCES`.
