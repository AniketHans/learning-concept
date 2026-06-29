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
  while (!(await getJobStatus(req.params.jobid)));
  res.end(`Job Done with id ${req.params.jobid}`);
});

function getJobStatus(jobid) {
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
