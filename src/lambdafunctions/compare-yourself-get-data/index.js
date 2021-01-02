const AWS = require('aws-sdk');

//define outside of handler function 
//to give a chance for caching the code between lambda invocations
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-2'
});

const cisp = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const getAll = async(event) => {
  const params = {
    TableName: 'compare-yourself'
  }
  
  try {
    console.log('creating promise');
    const promise = new Promise((resolve, reject) => {
      console.log('scanning...');
      dynamodb.scan(params, (err, data) => {
        console.log('scan done');
        if (err) {
          console.log('scan returned error', err);
          reject(err)
        }
        else {
          console.log('scan returned data', JSON.stringify(data));
          resolve(data);
        }
      });
    });
  
    const result = await promise;
    const items = result.Items.map((item) => { 
      return { 
        //"userid": item.Userid.S, 
        "height": +item.Height.N, 
        "income": +item.Income.N, 
        "age": +item.Age.N 
      };
    });
  
    return items;
  }
  catch (err) { 
    console.log('caught error', err);
    return {
      error: err
    }
  }
};

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

const getSingle = async(event) => {
  try {
    const userId = await getUserId(event);
    
    const params = {
      TableName: 'compare-yourself',
      Key: {
        'Userid': {
          S: '' + userId
        }
      }
    }
    
    console.log('creating promise');
    const promise = new Promise((resolve, reject) => {
      console.log('get... with params', params);
      dynamodb.getItem(params, (err, data) => {
        console.log('get done');
        if (err) {
          console.log('get returned error', err);
          reject(err)
        }
        else {
          console.log('get returned data', JSON.stringify(data));
          resolve(data);
        }
      });
    });
  
    const result = await promise;
    //return result;
    return [{
      //"userid": result.Item.Userid.S, 
      "height": +result.Item.Height.N, 
      "income": +result.Item.Income.N, 
      "age": +result.Item.Age.N 
    }];
  }
  catch (err) { 
    console.log('caught error', err);
    return {
      error: err
    }
  }
};

exports.handler = async (event) => {
    const type = event.type;
    console.log('type', type);
    if (type === 'all') {
      return getAll(event);
    }
    else if (type === 'single') {
      return getSingle(event);
    }
    else { 
      return 'Unknown type ' + type;
    }
};
