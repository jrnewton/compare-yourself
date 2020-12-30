const AWS = require('aws-sdk');

//define outside of handler function 
//to give a chance for caching the code between lambda invocations
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-2'
});

exports.handler = async (event) => {
  const params = {
    TableName: 'compare-yourself',
    Key: {
      'Userid': {
        S: 'user_0.0025010169283241623'
      }
    }
  }
  
  try {
    console.log('creating promise');
    const promise = new Promise((resolve, reject) => {
      console.log('delete...');
      dynamodb.deleteItem(params, (err, data) => {
        console.log('delete done');
        if (err) {
          console.log('delete returned error', err);
          reject(err)
        }
        else {
          console.log('delete returned data', JSON.stringify(data));
          resolve(data);
        }
      });
    });
  
    const result = await promise;
    return JSON.stringify(result);
  }
  catch (err) { 
    console.log('caught error', err);
    return {
      error: err
    }
  }
};
