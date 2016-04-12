import { Skill, Launch, Intent } from 'alexa-annotations';
import Response, { say } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import Twitter from './twitter';
import TwitterConfig from '../config/twitter.config.js';

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
      ask: text,
      reprompt: 'Do you want to hear another tweet?',
      card: { title: 'Kanye', content: text },
      attributes: { offset: offset + 1 }
    })).catch(error => {
      console.error(error);
      return say('I had trouble finding Kanye\'s tweets');
    });
  }

  @Intent('Love')
  love() {
    return say('I love Kanye as much as Kanye loves Kanye');
  }

  @Intent('LoveMe')
  loveMe() {
    return this._tweet('715370821368283136');
  }

  @Intent('Movie')
  movie() {
    return this._tweet('703600011884498945');
  }

  @Intent('Style')
  style() {
    return this._tweet('707705291056541697');
  }

  @Intent('Crazy')
  crazy() {
    return this._tweet(random(['702564264008159233', '699503963595472897']));
  }

  @Intent('Search')
  search({ query }) {
    return this.client.getSearch({ q: `${query} from:kanyewest` }).then(([tweet]) => this._tweet(tweet.id_str));
  }

  @Intent('Wisdom')
  wisdom() {
    return say('Wisdom');
    //return this._collection('id').then((tweets) => this._tweet(random(tweets).id_str));
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.NoIntent', 'AMAZON.StopIntent')
  goodbye() {
    return say('Goodbye');
  }

  _tweet(id) {
    return this.client.getTweet({ id }).then(({ text }) => say(text));
  }

  _getTweet(offset = 0) {
    return this.client.getUserTimeline({ screen_name: 'kanyewest', count: offset + 1, exclude_replies: true, include_rts: false }).then(
      (tweets) => tweets[tweets.length - 1]
    );
  }

}

export default Skill(Kanye);
