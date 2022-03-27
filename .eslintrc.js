const { join } = require('path');

module.exports = {
  root: true,
  parserOptions: {
    project: join(__dirname, 'tsconfig.json'),
  },
  extends: [
    'eslint-config-airbnb',
    'eslint-config-airbnb/hooks',
    'eslint-config-airbnb-typescript',
  ],
  rules: {
    'no-console': 'off',
  },
};
