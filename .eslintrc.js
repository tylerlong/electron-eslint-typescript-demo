const { join } = require('path');

module.exports = {
  root: true,
  parserOptions: {
    project: join(__dirname, 'tsconfig.json').replace('app.asar', 'app.asar.unpacked'),
  },
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb-typescript/base',
  ],
};
