'use strict';

const http = require('http');

function makeRequest() {

  http.get({
    host: 'localhost',
    port: 4589,
    path: '/hello',
  }, (response) => {
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => {
      console.log(body.toString());
    });
  });

}

makeRequest();