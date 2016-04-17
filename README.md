# Kanye Alexa Skill

An Alexa skill for the Amazon Echo. It reads Kanye's tweets using the [Twitter API](https://dev.twitter.com). Generated using [generator-alexa-skill](https://github.com/cameronhunter/generator-alexa-skill).

## Example phrases
```
Alexa, ask Kanye what's up
Alexa, ask Kanye for wisdom
Alexa, ask Kanye who's the greatest
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

### Package

```bash
npm run package
```

This creates `build/package.zip` containing the compiled skill - this can be uploaded directly to AWS Lambda. It exposes a single function `index.hander`. Skill utterances defined in the `model` directory are expanded and output to `build/UTTERANCES`.

### Deploy

```bash
npm run deploy
```

If you configure the project with AWS credentials then you can build, test, package and deploy the project with a single command. You can check it out in the [AWS console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/kanye).
