import { Skill, Launch, Intent } from 'alexa-annotations';
import Response, { say } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import Twitter, { hydrateTweetText } from './twitter';
import TwitterConfig from '../config/twitter.config.js';
import data, { Type } from './quotes';
import cleanup, { removeEntities } from './text-cleanup';

const random = (items) => items[Math.floor(Math.random() * items.length)];

const getMessage = (tweet) => {
  const { urls = [], media = [] } = tweet.entities || {};
  const text = cleanup(removeEntities(tweet.text, [...urls, ...media]));
  const image = media.map(media => media.media_url_https)[0];

  if (!text && image) {
    return { text: 'Kanye tweeted a photo, I\'ve sent it to your Alexa app', image };
  }

  if (!text && !image && urls.length) {
    return { text: 'Kanye tweeted a link, I\'ve sent it to your Alexa app' };
  }

  return { text, image };
};

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
    const max_id = this.attributes.max_id;
    return this._getTweet(max_id).then(({ tweet, maxId }) => {
      const { text } = getMessage(tweet);
      return Response.build({
        ask: `${text}. Would you like to hear another?`,
        reprompt: 'Do you want to hear another tweet?',
        ...this._tweetCard(tweet),
        attributes: { max_id: maxId }
      });
    }).catch(error => {
      console.error(error);
      return say('I had trouble finding Kanye\'s tweets');
    });
  }

  @Intent('Search')
  search({ query }) {
    return this.client.getSearch({ q: `${query} from:kanyewest` }).then(([tweet]) => {
      return this._tweetResponse(tweet);
    }).catch(() => {
      return say('I don\'t know anything about that');
    });
  }

  @Intent('Crazy', 'Greatest', 'Love', 'LoveMe', 'Movie', 'Quotes', 'Style', 'Wisdom')
  quote(slots, request) {
    return this._response(random(data[request.intent.name] || data.Quotes));
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.NoIntent', 'AMAZON.StopIntent')
  goodbye() {
    return this._response(random(data.Goodbye), false);
  }

  _response(quote, includeCard = true) {
    switch (quote.type) {
      case Type.Text:
        return this._quoteResponse(quote.text, includeCard);
      case Type.Tweet:
        return this.client.getTweet({ id: quote.id }).then(tweet => this._tweetResponse(tweet, includeCard));
      default:
        return Promise.reject('Unsupported quote type');
    }
  }

  _quoteResponse(text, includeCard = true) {
    return Response.build({
      say: text,
      ...(includeCard && { card: { title: 'Kanye quote', content: text } })
    });
  }

  _tweetResponse(tweet, includeCard = true) {
    const { text } = getMessage(tweet);
    return Response.build({
      say: text,
      ...(includeCard && this._tweetCard(tweet))
    });
  }

  _tweetCard(tweet) {
    const { image } = getMessage(tweet);
    return {
      card: {
        type: 'Standard',
        title: '@kanyewest',
        text: hydrateTweetText(tweet),
        ...(image && { image: { smallImageUrl: `${image}:medium`, largeImageUrl: `${image}:large` } })
      }
    };
  }

  _getTweet(max_id) {
    return this.client.getUserTimeline({ screen_name: 'kanyewest', max_id, count: 2 }).then(
      (tweets) => ({ tweet: tweets[0], maxId: (tweets[1] || {}).id_str })
    );
  }

}

export default Skill(Kanye);
