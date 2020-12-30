'use strict';

module.exports = {
  env: {
    es2018: true,
    node: true
  },
  /* eslint:recommended property enables rules that report common problems 
       See the list at https://eslint.org/docs/rules/ */
  /* eslint/prettier integration read https://bit.ly/3kQFe3u */
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'strict': 'error',
    'semi': 'error',
    'prettier/prettier': 'error'
  },
  plugins: ['prettier']
};
