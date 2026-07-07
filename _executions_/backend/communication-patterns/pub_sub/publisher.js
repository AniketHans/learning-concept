import amqp from "amqplib"

const message = process.argv[2]
async function connect(){
    const url = "amqp://admin:password@localhost:5672"
    const connection = await amqp.connect(url)
    const channel = await connection.createChannel()
    await channel.assertQueue("jobs")
    await channel.sendToQueue("jobs", Buffer.from(message))
    console.log(`Job ${message} sent succesfully`)
    await channel.close()
    await connection.close()
}

connect()