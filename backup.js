const events = require("events")
const emitter = new events()
const path = require("path")
const fs = require("fs")

emitter.on("backup", () => {
    const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "manga.json"), "utf-8")
    )
    const backup = JSON.parse(
        fs.readFileSync(path.join(__dirname, "backup", "manga.json"), "utf-8")
    )
    if (JSON.stringify(data) === JSON.stringify(backup)) {
        console.log(data.length, backup.length);
        console.log("Everything is up to date.");
    }
    else {
        const dataBuffer = JSON.stringify(data);
        console.log(data.length, backup.length);
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const day = new Date().getDay()
        const hour = new Date().getHours()
        const minute = new Date().getMinutes()
        const second = new Date().getSeconds()
        // fs.writeFileSync("./backup/timestamp.json", timestamp);
        // console.log(timestamp);

        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`
        // Append timestamp to the log file
        fs.appendFileSync("./backup/timestamp_log.log", "Date: " + formattedDate + "\n");
        fs.writeFileSync("./backup/manga.json", dataBuffer);

    }
})

setInterval(() => {
    emitter.emit("backup");
}, 5000);