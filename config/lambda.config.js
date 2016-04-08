const { name, description, version } = require('../package.json');

export default {
  accessKeyId: '',
  secretAccessKey: '',
  role: '',
  functionName: name,
  description: `${description} (version ${version})`,
  region: 'us-east-1',
  handler: 'index.handler'
};
