import WebSocket from "ws"
import readline from "readline"

const ws = new WebSocket("ws://localhost:9099")

// Create terminal input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ws.on("open", () => {
    console.log("Connected to server");

    startInputLoop();
});

ws.on("message", (message) => {

    // Move to new line before printing
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    console.log(message.toString());

    // Re-show prompt
    rl.prompt();
});

ws.on("close",()=>{
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log("Disconnected from server")
    rl.close();
})

ws.on("error", (err)=>{
    console.log("Err",err)
})



function startInputLoop() {

    rl.setPrompt("Enter message: ");

    rl.prompt();

    rl.on("line", (input) => {

        if (input === "exit") {
            ws.close();
            rl.close();
            return;
        }

        ws.send(input);

        rl.prompt();
    });
}

