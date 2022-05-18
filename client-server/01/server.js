'use strict';

const api = require('./tracer')('my-http-server-01');
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
  
  const tracer = api.trace.getTracer("server");
  
  const span = tracer.startSpan('handleRequest');
  
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