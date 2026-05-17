import {WebSocketServer} from "ws"
import {v4 as uuid} from "uuid"

const wss = new WebSocketServer({port: 9099})

console.log("Websocket running on ws://localhost:8080")

let connections = new Map()

wss.on("connection", (ws)=>{
    const id = uuid()

    console.log("Client connected with id:", id)

    ws.send(`Connected, your id is ${id}`)
    connections.set(id, ws)
    // console.log("******", connections)

    ws.on("message", (message)=>{
        console.log("Recieved:", message.toString())
        Array.from(connections.keys()).filter((connId)=> connId != id).forEach((connId)=>{
            connections.get(connId).send(`Message from connection ${id}: ${message}`)
        })
    })

    ws.on("close", ()=>{
        console.log(`Client ${id} is disconnected`)
        connections.delete(id)
        
        
    })

    ws.on("error", (err)=>{
        console.log("Error:", err)
    })
})