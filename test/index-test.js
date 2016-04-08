import test from 'ava';
import Skill, { Kanye } from '../src/kanye';
import { Request } from 'alexa-annotations';
import UserTimelineFixture from './fixtures/user_timeline.json';

test('LaunchRequest', t => {
  const event = Request.launchRequest().build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText', text: 'I\'m Kanye. Do you want to hear my tweets?' },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear my tweets?' } }
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
        outputSpeech: { type: 'PlainText', text: 'I\'m Kanye. Do you want to hear my tweets?' },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear my tweets?' } }
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
      sessionAttributes: { offset: 1 },
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText', text: 'Tribe changed music forever' },
        card: { type: 'Simple', title: 'Kanye', content: 'Tribe changed music forever' },
        reprompt: { outputSpeech: { type: 'PlainText', text: 'Do you want to hear another tweet?' } }
      }
    });
  });
});
