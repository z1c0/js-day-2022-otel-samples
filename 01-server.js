'use strict';

function main(nrOfJobs) {
  console.log("main starts")
  
  for (let i = 0; i < nrOfJobs; i += 1) {
    doWork(i);
  }

  console.log("main ends")
}

function doWork(nr) {
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // "simulate" work and burn CPU cycles
  }
  console.log("job #" + nr);
}


// start our app
main(10);