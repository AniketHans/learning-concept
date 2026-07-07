import amqp from "amqplib"

async function readMessage(){
    try{
        const url = "amqp://admin:password@localhost:5672"
        const connection = await amqp.connect(url)
        const channel = await connection.createChannel()
        const result =  await channel.assertQueue("jobs")

        channel.consume("jobs", message =>{
            const input = message.content.toString()
            console.log("Recieved job", input)
            channel.ack(message)
        })

        console.log("Waiting for message....")
    }catch(err){
        console.log("Error", err)
    }

}

readMessage()