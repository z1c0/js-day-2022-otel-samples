'use strict';

const api = require('./tracer')('my-http-client-02');
const http = require('http');

function makeRequest() {

  const tracer = api.trace.getTracer("client");
  
  const span = tracer.startSpan('makeRequest');
  span.setAttribute("host", "localhost");
  span.setAttribute("port", 4598); // see what I did there?
  span.setAttribute("path", "/hello");
  span.setAttribute("method", "GET");
  
  const headers = {};
  const ctx = api.trace.setSpan(api.context.active(), span);
  api.propagation.inject(ctx, headers, {
    set: (headers, _, value) => headers['my-fancy-header'] = value
  });

  http.get({
    // add headers here
    headers : headers,
    host: 'localhost',
    port: 4589,
    path: '/hello',
  }, (response) => {
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => {

      console.log(body.toString());
      
      span.setAttribute("code", 200);
      span.end();
    });
  });
}

makeRequest();