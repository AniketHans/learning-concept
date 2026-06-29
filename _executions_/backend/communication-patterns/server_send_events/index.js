import express from "express"
import {v4 as uuid} from "uuid"

const app = express()
const jobs = {}


app.post("/create-job",(req, res)=>{
    const jobId = uuid()
    jobs[jobId] = 0
    processJob(jobId)
    res.end(`The job id is ${jobId}`)
})

app.get("/status/:jobId", (req, res)=>{
    const prevStatus = 0
    res.setHeader("Content-Type","text/event-stream") // This header is necessary for telling that the response is a stream
    sendStatus(res, req.params.jobId, prevStatus)
})


function processJob(jobId){
    if (jobs[jobId] >= 100) return;
    setTimeout(()=>{
        jobs[jobId]+=10
        processJob(jobId)
    }, 2000)
}

function sendStatus(response, jobId, prevStatus){
    if (jobs[jobId]!=prevStatus){
        if (jobs[jobId]==100){
            response.end("data: "+ `Job ${jobId} ${jobs[jobId]} completed\n\n`)
            return
        }
        prevStatus= jobs[jobId]
        response.write("data: "+ `Job ${jobId} ${jobs[jobId]} completed\n\n`) // The data and last \n\n is necessary to mark a chunk of response so that the client can parse it
    }

    setTimeout(()=>{sendStatus(response, jobId, prevStatus)},1000)
}

app.listen(8002, (req, res)=>{
    console.log("Server started at 8002 port")
})