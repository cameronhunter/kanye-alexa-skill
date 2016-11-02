import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import Response, { say } from 'alexa-response';
import ssml from 'alexa-ssml-jsx';
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
  @Intent('AMAZON.HelpIntent')
  help() {
    return Response.build({
      ask: 'I\'m Kanye, a fan made skill for Alexa. Do you want to hear Kanye\'s tweets?',
      reprompt: 'Do you want to hear Kanye\'s tweets?'
    });
  }

  @Intent('LatestTweet', 'AMAZON.YesIntent')
  tweet() {
    const max_id = this.attributes.max_id;
    return this._getTweet(max_id).then(({ tweet, maxId }) => Response.build({
      ask: (
        <speak>
          <s>{getSpeakableText(tweet)}</s>
          <break time='1s' />
          <s>Would you like to hear another?</s>
        </speak>
      ),
      reprompt: 'Do you want to hear another tweet?',
      ...this._tweetCard(tweet),
      attributes: { max_id: maxId }
    })).catch(error => {
      console.error(error);
      return say('I had trouble finding Kanye\'s tweets. Please try again later.');
    });
  }

  @Intent('Search')
  search({ query }) {
    return this.client.getSearch({ q: `${query} from:kanyewest` }).then(([tweet]) => {
      return this._tweetResponse(tweet);
    }).catch(() => Response.build({
      ask: `Kanye hasn\'t tweeted about "${query}". Would you like to hear what he has tweeted about?`,
      reprompt: 'Do you want to hear Kanye\'s tweets?'
    }));
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
