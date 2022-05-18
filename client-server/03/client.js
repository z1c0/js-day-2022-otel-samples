'use strict';

const api = require('./tracer')('my-http-client-03');
const tracer = api.trace.getTracer("client");
const http = require('http');

function makeRequest() {

  const span = tracer.startSpan('makeRequest');
  
  // This is new. Set context for the HTTP library
  const ctx = api.trace.setSpan(api.context.active(), span);
  api.context.with(ctx, () => {
    http.get({
      host: 'localhost',
      port: 4589,
      path: '/hello',
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        console.log(body.toString());
        span.end();
      });
    });
  });
}

makeRequest();