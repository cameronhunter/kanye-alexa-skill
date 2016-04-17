import { Twitter } from 'twitter-node-client';

export const ERROR = {
  EMPTY_RESULT: 0
};

export default class Client {
  constructor(config) {
    this.client = new Twitter(config);
  }

  getUserTimeline(args) {
    return this._fetch('/statuses/user_timeline.json', { exclude_replies: true, include_rts: false, ...args });
  }

  getTweet(args) {
    return this._fetch('/statuses/show.json', args);
  }

  getSearch(args) {
    return this._fetch('/search/tweets.json', args).then(({ statuses }) => {
      return statuses.length ? statuses : Promise.reject(ERROR.EMPTY_RESULT);
    });
  }

  _fetch(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
      this._log('info', endpoint, params);
      this.client.getCustomApiCall(endpoint, params, reject, response => resolve(JSON.parse(response)));
    }).catch(error => {
      this._log('error', endpoint, params, error);
      return Promise.reject(error);
    });
  }

  _log(level, ...args) {
    console[level]('[Twitter]', ...args);
  }
}

export const hydrateTweetText = (tweet) => {
  const { urls = [], media = [] } = tweet.entities || {};
  const length = tweet.text.length;
  return [...urls, ...media].reduceRight((state, { type, indices, expanded_url }) => {
    const url = length === indices[1] && !!type ? '' : expanded_url;
    return state.substring(0, indices[0]) + url + state.substring(indices[1]);
  }, tweet.text);
};
