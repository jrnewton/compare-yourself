exports.handler = async (event) => {
  const token = event.authorizationToken;
  if (token === 'allow' || token === 'deny') {
    const policy = genPolicy(token, event.methodArn);  
    const principalId = 'id_' + Math.random();
    const context = { 
      simpleAuth: true
    }
    const response = {
      principalId: principalId,
      policyDocument: policy,
      context: context
    }
    console.log('auth response', response);
    return response;
  }
  else {
    throw new Error('Unauthorized');
  }
};

const genPolicy = (effect, resource) => {
  const policy = {};
  policy.Version = '2012-10-17';
  policy.Statement = [];
  policy.Statement.push({
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
  });
  
  return policy;
};