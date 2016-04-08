import { Twitter } from 'twitter-js-client';

export default class Client {
  constructor(config) {
    this.client = new Twitter(config);
  }

  getUserTimeline(...args) {
    return new Promise((resolve, reject) => {
      this.client.getUserTimeline(...args, reject, _ => resolve(JSON.parse(_)));
    });
  }
}
