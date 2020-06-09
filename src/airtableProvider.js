const Airtable = require('airtable')
const {MY_AIRTABLE_API_KEY, AIRTABLE_BASE_ID} = require('../config');

module.exports = new Airtable({apiKey: MY_AIRTABLE_API_KEY}).base(AIRTABLE_BASE_ID)