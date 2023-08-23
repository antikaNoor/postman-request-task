const events = require("events")
const emitter = new events()

//the listener
emitter.on("test", (data)=>{
    console.log(data.message)
})

//the trigger part
emitter.emit("test", {message: "Trigger"})