const slug = require('slug');

const {AIRTABLE_TABLE, ALGOLIA_INDEX} = require('./config');

const base = require('./src/airtableProvider');
const client = require('./src/algoliaProvider');

let count = 0;

function getAlgoliaIndex(indexName) {
  const index = client.initIndex(indexName);
  return index;
}

function mapToAlogilaRecord(record) {
  const algoliaRecord = {};

  Object.keys(record).map(fieldName => {
    const newFieldName = fieldName === 'objectID' ? fieldName : slug(fieldName, '_');
    algoliaRecord[newFieldName] = record[fieldName];
  });

  return algoliaRecord;
}

exports.handler = function run(event, context, callback) {
  const algoliaIndex = getAlgoliaIndex(ALGOLIA_INDEX);
  
  return new Promise(function(resolve, reject) {
    base(AIRTABLE_TABLE).select({
      // Selecting the first 3 records in All Data:
      maxRecords: 20000,
      view: "All Data"
    }).eachPage(async function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
  
      // Create a record list
      const recordList = records.map(record => mapToAlogilaRecord({...record.fields, ...{objectID: record.id}}));
  
      console.log('recordlist', recordList);
      // Index in algolia
      try {
        await algoliaIndex.saveObjects(recordList);
      } catch(e) {
        console.log(e);
        reject(e);
      }
  
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      count += records.length;
      console.log(count);
  
      fetchNextPage();
  
    }, function done(err) {
      if (err) { console.error(err); reject(err); return; }
      resolve('Whoop, all records updated');
    });
  });
}