const http = require("http")
const path = require("path")
const fs = require("fs")
const queryString = require("querystring")
const url = require("url")
const { json } = require("stream/consumers")

/* TASK!!! */

// add the data in the body of your request
// task - async read and write file functions
// 2 routes - getting all the products and adding a product

// if (request.url === "/product/create" && request.method === "POST")
// try catch logic
// must have a response - success or error
//everything inside the body should be in the "end"

const server = http.createServer((request, response) => {

    try {
        //right before the response is being sent
        if (request.url === "/data/create" && request.method === "POST") {

            fs.readFile(
                path.join(__dirname, "data", "manga.json"),
                (err, data) => {
                    if (!err) {
                        response.writeHead(200, { "Content-Type": "application/json" })
                        response.write(JSON.stringify({ message: "Successfully read data!" }))
                        let body = ""

                        request.on("data", (buffer) => {
                            body += buffer
                        })

                        request.on("end", () => {

                            const newManga = JSON.parse(body)
                            if (!JSON.stringify(newManga.name)) {
                                response.write(JSON.stringify({ message: "Please enter a name for the object" }));
                                return response.end();
                            }
                            const jsonData = JSON.parse(data)
                            const lastId = jsonData.length > 0 ? jsonData[jsonData.length - 1].id : 0

                            const newData = {
                                id: lastId + 1,
                                ...newManga
                            }
                            jsonData.push(newData)

                            fs.writeFile(
                                path.join(__dirname, "data", "manga.json"), JSON.stringify(jsonData),
                                (error) => {
                                    if (!error) {
                                        response.write(JSON.stringify({ message: "Successfully added data!" }))
                                        const year = new Date().getFullYear()
                                        const month = new Date().getMonth()
                                        const day = new Date().getDay()
                                        const hour = new Date().getHours()
                                        const minute = new Date().getMinutes()
                                        const second = new Date().getSeconds()
                                        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`
                                        // Append timestamp to the log file
                                        fs.appendFile("./data/timestamp_log.log", "Data added: " + formattedDate + "\n", (error) => {
                                            if (!error) {
                                                console.log("Timestamp added to the log.")
                                            } else {
                                                console.error("Error adding timestamp to the log:", error)
                                            }
                                        })
                                    } else {
                                        response.write(JSON.stringify({ message: "Can't add data" }))
                                    }
                                    response.end()
                                }
                            )
                        })
                    }
                    else {
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.write(JSON.stringify({ message: "Error reading data" }));
                        return response.end();
                    }
                })
        }
        else {
            // Handling GET requests to the POST route
            response.writeHead(405, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: "Method not allowed. Use POST method." }));
            return response.end()

        }
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ message: "Internal server error" }))
        return response.end()
    }


    /* READING FILES SYNCHRONOUSLY */
    // try {
    //     if (request.url === "/product/all" && request.method === "GET") {
    //         const data = JSON.parse(fs.readFileSync("./product/products.json"))
    //         response.writeHead(200, { "Content-Type": "application/json" }) //right before the response is being sent
    //         response.write(JSON.stringify({ message: "Successfully recieved data!", data: data }))

    //     }
    //     //can't call it a second time. the system will crash.
    //     return response.end()
    // } catch (error) {
    //     response.writeHead(500, { "Content-Type": "application/json" })
    //     response.write(JSON.stringify({ message: "Internal server error" }))
    //     return response.end()
    // }

    /* READING FILES ASYNCHRONOUSLY */
    // try {

    //     response.writeHead(200, { "Content-Type": "application/json" }) //right before the response is being sent
    //     fs.readFile(
    //         path.join(__dirname, "product", "products.json"),
    //         (error, data) => {
    //             if (!error) {
    //                 const jsonData = JSON.parse(data)
    //                 response.write(JSON.stringify(jsonData))
    //                 return response.end()
    //             }
    //         }
    //     )
    // } catch (error) {
    //     response.writeHead(500, { "Content-Type": "application/json" })
    //     response.write(JSON.stringify({ message: "Internal server error" }))
    //     return response.end()
    // }

    /* CREATING DATA */
    //the data event starts emitting only after all the data is recieved

    // let body = ""
    // request.on("data", (buffer) => {
    //     // console.log(buffer)
    //     body += buffer
    // })
    // request.on("end", () => {
    //     console.log("Data received: ", JSON.parse(body).name)
    // })
})

server.listen(8000, () => {
    console.log("Server is running on 8000...")
})