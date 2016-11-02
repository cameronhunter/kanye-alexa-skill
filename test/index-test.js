import test from 'ava';
import Skill, { Kanye } from '../src/kanye';
import Request from 'alexa-request';
import UserTimelineFixture from './fixtures/user_timeline.json';
import UserTimelineWithMediaFixture from './fixtures/tweet_with_media.json';
import SearchFixture from './fixtures/search.json';

test('LaunchRequest', t => {
  const event = Request.launchRequest().build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText', text: 'I\'m Kanye, a fan made skill for Alexa. Do you want to hear Kanye\'s tweets?' },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear Kanye\'s tweets?' } }
      }
    });
  });
});

test('Help intent', t => {
  const event = Request.intent('AMAZON.HelpIntent').build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText', text: 'I\'m Kanye, a fan made skill for Alexa. Do you want to hear Kanye\'s tweets?' },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear Kanye\'s tweets?' } }
      }
    });
  });
});

test('Latest tweet intent', t => {
  const skill = new Kanye({}, {
    getUserTimeline() {
      return Promise.resolve(UserTimelineFixture);
    }
  });

  return skill.tweet().then(response => {
    t.deepEqual(response.build(), {
      version: '1.0',
      sessionAttributes: { max_id: '717490840239783937' },
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText', text: 'Tribe changed music forever. Would you like to hear another?' },
        card: { type: 'Standard', title: '@kanyewest', text: 'Tribe changed music forever' },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear another tweet?' } }
      }
    });
  });
});

test('Latest tweet is media only', t => {
  const skill = new Kanye({}, {
    getUserTimeline() {
      return Promise.resolve(UserTimelineWithMediaFixture);
    }
  });

  return skill.tweet().then(response => {
    t.deepEqual(response.build(), {
      version: '1.0',
      sessionAttributes: { max_id: '716380100820754432' },
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText', text: 'Kanye tweeted a photo, I\'ve sent it to your Alexa app. Would you like to hear another?' },
        card: {
          type: 'Standard',
          title: '@kanyewest',
          text: '',
          image: {
            smallImageUrl: 'https://pbs.twimg.com/media/Cf-oEz6W4AAoNX-.jpg:medium',
            largeImageUrl: 'https://pbs.twimg.com/media/Cf-oEz6W4AAoNX-.jpg:large'
          }
        },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear another tweet?' } }
      }
    });
  });
});

test('Search intent', t => {
  const skill = new Kanye({}, {
    getSearch() {
      return Promise.resolve(SearchFixture.statuses);
    }
  });

  return skill.search({ query: 'music' }).then(response => {
    t.deepEqual(response.build(), {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'I\'m so happy that you guys like the music. I\'m working on the tour designs now.' },
        card: { type: 'Standard', title: '@kanyewest', text: 'I’m so happy that you guys like the music…  I’m working on the tour designs now…' }
      }
    });
  });
});
