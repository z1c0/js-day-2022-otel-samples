'use strict';

const api = require('./tracer')('my-http-server-02');
const http = require('http');

/** Starts a HTTP server that receives requests on sample server port. */
function startServer(port) {
  // Creates a server
  const server = http.createServer(handleRequest);
  // Starts the server
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Node HTTP listening on ${port}`);
  });
}

/** A function which handles requests and send response. */
function handleRequest(request, response) {
  console.log("handling request");

  // Let's print the incoming headers
  console.log(request.headers);
  
  const tracer = api.trace.getTracer("server");

  // One of the headers is our serialized span information
  const context = api.propagation.extract(api.ROOT_CONTEXT, request.headers, { 
    get: (headers, _,) => headers['my-fancy-header']
  });

  // Let's make this span (context) parent of our new span.
  const span = tracer.startSpan('handleRequest', undefined, context);
  
  try {
    const body = [];
    request.on('error', (err) => console.log(err));
    request.on('data', (chunk) => body.push(chunk));
    request.on('end', () => {
      // deliberately sleeping to mock some action.
      setTimeout(() => {
        span.end();
        response.end('Hello WeAreDevelopers!');
      }, 1000);
    });
  } catch (err) {
    console.error(err);
    span.end();
  }
}


startServer(4589);