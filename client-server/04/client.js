'use strict';

const api = require('./tracer')('my-http-client-04');
const http = require('http');

function makeRequest() {

  api.context.with(api.context.active(), () => {
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
  });
}

makeRequest();