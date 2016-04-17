const transforms = [
  { pattern: /[’]/g, replacement: '\'' },
  { pattern: /[…]/g, replacement: '.' },
  { pattern: /[!]+/g, replacement: '!' },
  { pattern: /[\.]+/g, replacement: '.' },
  { pattern: /\s+/g, replacement: ' ' }
];

export default (text) => {
  return transforms.reduce((state, { pattern, replacement }) => state.replace(pattern, replacement), text).trim();
};

export const removeEntities = (text, entities) => {
  return entities.reduceRight((state, { indices }) => state.substring(0, indices[0]) + state.substring(indices[1]), text);
};
