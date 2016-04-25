import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import Response, { say } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import Twitter, { hydrateTweetText } from './twitter';
import TwitterConfig from '../config/twitter.config.js';
import data, { Type } from './quotes';
import { getSpeakableText, getImages } from './tweet-cleanup';

const random = (items) => items[Math.floor(Math.random() * items.length)];

export class Kanye {

  constructor(attributes, client = new Twitter(TwitterConfig)) {
    this.attributes = attributes || {};
    this.client = client;
  }

  @Launch
  launch() {
    return Response.build({
      ask: 'I\'m hip hop artist. Do you want to hear tweets?',
      reprompt: 'Do you want to hear tweets?'
    });
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return Response.build({
      ask: 'I\'m hip hop artist, I read hip hop tweets. Do you want to hear them?',
      reprompt: 'Do you want to hear tweets?'
    });
  }

  @Intent('LatestTweet', 'AMAZON.YesIntent')
  tweet() {
    const max_id = this.attributes.max_id;
    return this._getTweet(max_id).then(({ tweet, maxId }) => Response.build({
      ask: `${getSpeakableText(tweet)}. Would you like to hear another?`,
      reprompt: 'Do you want to hear another tweet?',
      ...this._tweetCard(tweet),
      attributes: { max_id: maxId }
    })).catch(error => {
      console.error(error);
      return say('I had trouble finding hiphop tweets');
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

  @Intent('Crazy', 'Greatest', 'Love', 'LoveMe', 'Movie', 'Style', 'Wisdom')
  quote(slots, request) {
    return this._response(random(data[request.intent.name] || data.Quotes));
  }

  @SessionEnded
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
      ...(includeCard && { card: { title: 'Quote', content: text } })
    });
  }

  _tweetResponse(tweet, includeCard = true) {
    return Response.build({
      say: getSpeakableText(tweet),
      ...(includeCard && this._tweetCard(tweet))
    });
  }

  _tweetCard(tweet) {
    return {
      card: {
        type: 'Standard',
        title: '@kanyewest',
        text: hydrateTweetText(tweet),
        ...getImages(tweet)
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
