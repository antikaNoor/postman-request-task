const fs = require("fs");

class Product {
    getAll() {
        const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
        return data;
    }

    getOneById(id) {
        const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
        const findData = data.find((element) => element.id === id);
        if (findData) {
            // If data is found with the corresponding ID, then only that data will be returned
            return findData;
        }

        // If no data is found with the corresponding ID, then this message will be returned instead
        return "The data does not exist";
    }

    add(product) {
        const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
        const newData = { ...product, id: data[data.length - 1].id + 1 };
        data.push(newData);
        fs.writeFileSync("./data/manga.json", JSON.stringify(data));
        console.log("Object has been successfully added");
        return newData;
    }

    updateById(id, product) {
        const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));

        const idx = data.findIndex((element) => element.id === id)
        if(idx>=0) {
            data[idx] = { ...data[idx], ...product }
            console.log(data[idx])
            const dataBuffer = JSON.stringify(data)
            fs.writeFileSync("./data/manga.json", dataBuffer)
        }
        else {
            console.log("Enter a valid id")
        }
    }

    deletetById(id) {
        const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
        const updatedData = data.filter((element) => element.id !== id);
        if (updatedData) {
            fs.writeFileSync("./data/manga.json", JSON.stringify(updatedData));
            return "Product successfully deleted!";
        }
        return "ID was not a valid one";
    }
}

module.exports = new Product();