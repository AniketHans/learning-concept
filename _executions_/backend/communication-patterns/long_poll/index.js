/*
  Long polling is a technique where the client asks the server for new data, but instead of responding immediately, the server waits until it has new data (or a timeout occurs).

  How it works
  Client sends a request: "Do you have any new messages?"
  Server keeps the request open if there's nothing new.
  When new data arrives, the server sends the response.
  The client immediately sends another request and the cycle repeats.
*/

import express from "express";

const app = express();
const jobs = {};
let jobNum = 0;

app.post("/job", (req, res) => {
  jobNum++;
  jobs[jobNum] = 0;
  processJob(jobNum);
  res.send(`Job Id: ${jobNum}`);
});

app.get("/status/:jobid", async (req, res) => {
  while (!(await getJobStatus(req.params.jobid))); // Wait till the job is completed then it will send the response
  res.end(`Job Done with id ${req.params.jobid}`);
});

function getJobStatus(jobid) {
  // checks the status of te job
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (jobs[jobid] < 100) {
        resolve(false);
      }
      resolve(true);
    }, 100);
  });
}

function processJob(jobid) {
  // processes the job async
  const TO = setTimeout(() => {
    jobs[jobid] += 10;
    console.log(`Job ${jobid} processed ${jobs[jobid]}%`);
    processJob(jobid);
  }, 2000);
  if (jobs[jobid] == 100) {
    clearTimeout(TO);
  }
}

app.listen(8001, () => {
  console.log("App is listening at PORT 8001");
});
