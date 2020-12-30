const AWS = require('aws-sdk');

//define outside of handler function 
//to give a chance for caching the code between lambda invocations
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-2'
});

exports.handler = async(event, context) => {
//NOTE: pass all _values_ as strings
  const params = {
    Item: {
      'Userid': {
        S: 'user_' + Math.random()
      },
      'Age': {
        N: event.age
      },
      'Height': {
        N: event.height
      },
      'Income': {
        N: event.income
      }
    },
    TableName: 'compare-yourself'
  };
  
  const promise = new Promise((resolve, reject) => {
    console.log('create promise');
    dynamodb.putItem(params, (err, data) => { 
      console.log('in putItem callback');
      if (err) {
        console.log('got error', err);
        reject(err);
      }
      else {
        console.log('got data', err);
        resolve(data);
      }
    });
  });
  
  try {
    const data = await promise;
    console.log('await over, data', data);
    const payload = {
      data: data
    };
    console.log('payload', payload);
    return payload;
  }
  catch (err) {
    console.log('caught err', err);
    const payload = {
      err: err
    }
    console.log('payload', payload);
    return payload;
  }
};
