const transforms = [
  { pattern: /[’]/g, replacement: '\'' },
  { pattern: /[…]/g, replacement: '.' },
  { pattern: /[!]+/g, replacement: '!' },
  { pattern: /[\.]+/g, replacement: '.' },
  { pattern: /\s+/g, replacement: ' ' }
];

const cleanup = (text) => {
  return transforms.reduce((state, { pattern, replacement }) => state.replace(pattern, replacement), text).trim();
};

const removeEntities = (text, entities) => {
  return entities.reduceRight((state, { indices }) => state.substring(0, indices[0]) + state.substring(indices[1]), text);
};

const getTextAndImage = (tweet) => {
  const { urls = [], media = [] } = tweet.entities || {};
  const text = cleanup(removeEntities(tweet.text, [...urls, ...media]));
  const image = media.map(media => media.media_url_https)[0];

  return { text, image, urls };
};

export const getSpeakableText = (tweet) => {
  const { text, image, urls } = getTextAndImage(tweet);

  if (!text && image) {
    return 'Kanye tweeted a photo, I\'ve sent it to your Alexa app';
  }

  if (!text && !image && urls.length) {
    return 'Kanye tweeted a link, I\'ve sent it to your Alexa app';
  }

  return text;
};

export const getImages = (tweet) => {
  const { image } = getTextAndImage(tweet);
  return !image ? {} : {
    image: {
      smallImageUrl: `${image}:medium`,
      largeImageUrl: `${image}:large`
    }
  };
};
