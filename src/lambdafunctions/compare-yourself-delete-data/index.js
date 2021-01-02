const AWS = require('aws-sdk');

//define outside of handler function 
//to give a chance for caching the code between lambda invocations
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-2'
});

const cisp = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const getUserId = (event) => {
  return new Promise((resolve, reject) => {
    console.log('getUserId for token', event.accessToken);
    
    const cispParams = {
      "AccessToken": event.accessToken //via body mapping template
    };
    
    cisp.getUser(cispParams, (err, result) => {
      if (err) {
        console.log('failed on cisp.getUser', err);
        reject(err);
      }
      else {
        console.log('success on cisp.getUser', result);
        //userid is always index zero.  See docs.
        const userId = result.UserAttributes[0].Value;
        console.log('userid is', userId);
        resolve(userId);
      }
    });  
  });
}

exports.handler = async (event) => {
  const userId = await getUserId(event);
  
  const params = {
    TableName: 'compare-yourself',
    Key: {
      'Userid': {
        S: '' + userId
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
