import { Skill, Launch, Intent } from 'alexa-annotations';
import Response, { say } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import Twitter from './twitter';
import TwitterConfig from '../config/twitter.config.js';

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
      return say('I had trouble find Kanye\'s latest tweet');
    });
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.NoIntent', 'AMAZON.StopIntent')
  goodbye() {
    return say('Goodbye');
  }

  _getTweet(offset = 0) {
    return this.client.getUserTimeline({ screen_name: 'kanyewest', count: offset + 1, exclude_replies: true, include_rts: false }).then(
      (tweets) => tweets[tweets.length - 1]
    );
  }

}

export default Skill(Kanye);
