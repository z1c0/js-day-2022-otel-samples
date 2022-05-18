'use strict';

const http = require('http');

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

function handleRequest(request, response) {
  console.log("handling request");
  
  try {
    const body = [];
    request.on('error', (err) => console.log(err));
    request.on('data', (chunk) => body.push(chunk));
    request.on('end', () => {
      // deliberately sleeping to mock some action.
      setTimeout(() => {
        response.end('Hello WeAreDevelopers!');
      }, 500);
    });
  } catch (err) {
    console.error(err);
  }
}


startServer(4589);