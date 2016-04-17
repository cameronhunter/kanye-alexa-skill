import { Skill, Launch, Intent } from 'alexa-annotations';
import Response, { say } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import Twitter from './twitter';
import TwitterConfig from '../config/twitter.config.js';
import data, { Type } from './quotes';

const random = (items) => items[Math.floor(Math.random() * items.length)];

export class Kanye {

  constructor(attributes, client = new Twitter(TwitterConfig)) {
    this.attributes = attributes || {};
    this.client = client;
  }

  @Launch
  @Intent('AMAZON.HelpIntent')
  launch() {
    return Response.build({
      ask: 'I\'m Kanye. Do you want to hear my tweets?',
      reprompt: 'Do you want to hear my tweets?'
    });
  }

  @Intent('LatestTweet', 'AMAZON.YesIntent')
  tweet() {
    const offset = this.attributes.offset || 0;
    return this._getTweet(offset).then(({ text }) => Response.build({
      ask: `${text}. Would you like to hear another?`,
      reprompt: 'Do you want to hear another tweet?',
      card: { title: 'Kanye', content: text },
      attributes: { offset: offset + 1 }
    })).catch(error => {
      console.error(error);
      return say('I had trouble finding Kanye\'s tweets');
    });
  }

  @Intent('Search')
  search({ query }) {
    return this.client.getSearch({ q: `${query} from:kanyewest` })
            .then(([tweet]) => this._text(tweet.text))
            .catch(() => say('I don\'t know anything about that'));
  }

  @Intent('Crazy', 'Greatest', 'Love', 'LoveMe', 'Movie', 'Quotes', 'Style', 'Wisdom')
  quote(slots, request) {
    const category = request.intent.name.toLowerCase();
    return this._response(random(data[category] || data.quotes));
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.NoIntent', 'AMAZON.StopIntent')
  goodbye() {
    return this._response(random(data.greatest), false);
  }

  _response(quote, includeCard = true) {
    switch (quote.type) {
      case Type.Text:
        return this._text(quote.text, includeCard);
      case Type.Tweet:
        return this._tweet(quote.id, includeCard);
      default:
        return Promise.reject('Unsupported quote type');
    }
  }

  _text(text, includeCard = true) {
    return Response.build({
      say: text,
      ...(includeCard && { card: { title: 'Kanye', content: text } })
    });
  }

  _tweet(id, includeCard = true) {
    return this.client.getTweet({ id }).then(tweet => this._text(tweet.text, includeCard));
  }

  _getTweet(offset = 0) {
    return this.client.getUserTimeline({ screen_name: 'kanyewest', count: offset + 1 }).then(
      (tweets) => tweets[tweets.length - 1]
    );
  }

}

export default Skill(Kanye);
