'use strict';
//
// Bring in OpenTelemetry
//
const api = require('@opentelemetry/api');

//
// First, we need a tracer.
//
const tracer = api.trace.getTracer('server');


function main(nrOfJobs) {
  //
  // Create our first (the main) span
  //
  const mainSpan = tracer.startSpan('main');
  
  // Set attribute data (arbitrary key-value pairs) on the span.
  mainSpan.setAttribute("nr-of-jobs", nrOfJobs);

  console.log("main starts") 
  
  for (let i = 0; i < nrOfJobs; i += 1) {
    // pass mainSpan as parent
    doWork(i, mainSpan);
  }

  console.log("main ends")

  mainSpan.end();
}

function doWork(nr, parentSpan) {
  // Create child span with parent
  const ctx = api.trace.setSpan(api.context.active(), parentSpan);
  const childSpan = tracer.startSpan("doWork", undefined, ctx)
  childSpan.setAttribute("worker-nr", nr);

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  console.log("job #" + nr);

  childSpan.end();
}


// start our app
main(10);