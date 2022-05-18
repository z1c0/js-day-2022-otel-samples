'use strict';

const api = require('./tracer')('my-http-client-01');
const http = require('http');

function makeRequest() {

  const tracer = api.trace.getTracer("client");

  const span = tracer.startSpan('makeRequest');
  
  span.setAttribute("host", "localhost");
  span.setAttribute("port", 4598); // see what I did there?
  span.setAttribute("path", "/hello");
  span.setAttribute("method", "GET");

  http.get({
    host: 'localhost',
    port: 4589,
    path: '/hello',
  }, (response) => {
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => {

      // put response info on the span
      span.setAttribute("code", 200);

      console.log(body.toString());
      span.end();
    });
  });
}

makeRequest();