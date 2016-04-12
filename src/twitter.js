import { Twitter } from 'twitter-node-client';

export default class Client {
  constructor(config) {
    this.client = new Twitter(config);
  }

  getUserTimeline(args) {
    return this._fetch('getUserTimeline', args);
  }

  getTweet(args) {
    return this._fetch('getTweet', args);
  }

  getSearch(args) {
    return this._fetch('getSearch', args);
  }

  _fetch(fn, args) {
    return new Promise((resolve, reject) => {
      this.client[fn](args, reject, response => resolve(JSON.parse(response)));
    });
  }
}
