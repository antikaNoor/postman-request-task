const fs = require("fs")
const fsPromise = require("fs").promises
const path = require("path")

class Product {

    //get all
    async getAll() {
        return fsPromise
            .readFile(path.join(__dirname, "..", "data", "manga.json"), {
                encoding: "utf-8"
            })
            .then((data) => {
                // just an example of destructuring
                const dataJson = JSON.parse(data)
                const { id, name, price, stock, author } = dataJson[0]
                console.log("id: ", id)
                console.log("name: ", name)
                console.log("price: ", price)

                return { success: true, data: data }
            })
            .catch((error) => {
                return { success: false }
            })
    }

    //get one by id
    async getOneById(id) {
        return fsPromise
            .readFile(path.join(__dirname, "..", "data", "manga.json"), {
                encoding: "utf-8"
            })
            .then((data) => {
                const findData = JSON.parse(data).find((element) => {
                    return element.id === id
                })
                if (findData) {
                    // console.log(findData)
                    return { success: true, data: JSON.stringify(findData) }
                }
                else {
                    return { success: false }
                }
            })
            .catch((error) => {
                return { success: false }
            })
    }


    //add to the json file 
    async add(body) {
        try {
            const data = await fsPromise.readFile(path.join(__dirname, "..", "data", "manga.json"), {
                encoding: "utf-8"
            })

            const newManga = JSON.parse(body)


            const jsonData = JSON.parse(data)
            const lastId = jsonData.length > 0 ? jsonData[jsonData.length - 1].id : 0

            const newData = {
                id: lastId + 1,
                ...newManga
            }
            jsonData.push(newData)

            await fsPromise.writeFile(
                path.join(__dirname, "..", "data", "manga.json"),
                JSON.stringify(jsonData),
                { encoding: "utf-8" }
            )

            return { success: true, message: "Manga added successfully" }
        } catch (error) {
            return { success: false, message: "Error reading file or parsing JSON" }
        }
    }
}

module.exports = new Product()