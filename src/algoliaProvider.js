const algoliasearch = require('algoliasearch');
const {ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY} = require('../config');

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);

module.exports = client;