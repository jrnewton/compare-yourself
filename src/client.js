// Run using codepen.io
// https://codepen.io/newtnik/pen/ZEpvPvq?editors=0011

const callAPI = async (url, method, body) => {
  try {
    const options = {
      method: method,
      mode: 'cors'
    };

    console.log(method, 'options', options);

    if (body) {
      options.headers = {
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(body);
      console.log(method, 'options updated', options);
    }

    console.log(method, 'calling fetch');
    const fetchPromise = fetch(url, options);

    console.log(method, 'awaiting fetch promise');
    const response = await fetchPromise;

    console.log(method, 'fetch promise resolved');
    if (response.ok) {
      console.log(method, 'response is ok');
      const data = await response.json();
      console.log(method, 'response body', data);
    } else {
      console.log(
        method,
        'response is not ok',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.log(method, 'caught an error', JSON.stringify(error.message));
  }
};

const url =
  'https://8dqz0v87p3.execute-api.us-east-2.amazonaws.com/dev/compare-yourself';

//callAPI(url, 'POST', { age: 1,  height: 2, income: 3 });
callAPI(url + '/single', 'GET');
//callAPI(url, 'DELETE');
