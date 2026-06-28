import express from "express"
import {v4 as uuid} from "uuid"

const app = express()
const jobs = {}

app.post("/submit", (req,res)=>{
    const jobId = String(uuid())
    updateJobStatus(jobId, 0)
    res.send(jobId)
})

app.get('/job-status/:jobId', (req, res)=>{
    const jobId = req.params.jobId
    console.log(jobId)
    res.end(`Job status: ${jobs[jobId]}`)
})

app.listen(8000, ()=>{
    console.log("Running at port 8000")
})

function updateJobStatus(jobId, prog){
    jobs[jobId] = prog
    if (prog===100) return 
    setTimeout(()=>updateJobStatus(jobId, prog+10), 2000)
}
