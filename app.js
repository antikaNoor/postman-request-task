// const Product = require("./product")
const http = require("http")
const { success, failure } = require("./utils/success-error")
const Products = require("./model/products")
const path = require("path")
// const { fail } = require("assert")
// const product = require("./product")

const server = http.createServer(async (request, response) => {

  const getQueryParams = () => {
    if (request.url.startsWith("/products/detail") && request.method === "GET") {
      const urlParts = request.url.split("?")
      if (urlParts.length < 2) {
        return null
      }

      const params = new URLSearchParams(urlParts[1])
      const queryParams = {}
      for (const [param, value] of params) {
        queryParams[param] = value
      }
      return queryParams
    }
  }
  // const queryParams = getQueryParams()

  //   if (queryParams !== null) {
  //     const id = queryParams.id
  //     if (id) {
  //       // Read the JSON file and find the desired product
  //       fs.readFile(path.join(__dirname, "data", "manga.json"), (err, data) => {
  //         if (err) {
  //           response.writeHead(500, { "Content-Type": "application/json" })
  //           response.write(
  //             JSON.stringify(failure("Internal Server Error"))
  //           )
  //           return response.end()
  //         }

  //         try {
  //           const products = JSON.parse(data)
  //           const foundProduct = products.find(item => item.id === id)
  //           if (foundProduct) {
  //             response.writeHead(200, { "Content-Type": "application/json" })
  //             response.write(
  //               JSON.stringify(success("Successfully got the product", foundProduct))
  //             )
  //           } else {
  //             response.writeHead(400, { "Content-Type": "application/json" })
  //             response.write(
  //               JSON.stringify(failure("Failed to get the product"))
  //             )
  //           }
  //           return response.end()
  //         } catch (error) {
  //           response.writeHead(500, { "Content-Type": "application/json" })
  //           response.write(
  //             JSON.stringify(failure("Internal Server Error"))
  //           )
  //           return response.end()
  //         }
  //       })
  //     } else {
  //       // Handle the case when "id" is missing in the query parameters
  //       response.writeHead(400, { "Content-Type": "application/json" })
  //       response.write(
  //         JSON.stringify(failure("ID not found"))
  //       )
  //       return response.end()
  //     }
  //   } else {
  //     // Handle the case when no query parameters are present
  //     response.writeHead(400, { "Content-Type": "application/json" })
  //     response.write(
  //       JSON.stringify(failure("Body not found"))
  //     )
  //     return response.end()
  //   }


  // // getQueryParams()
  const requestURL = request.url.split("?")[0]
  // // const queryURL = request.url.split("?")[1]

  // get all 
  if (requestURL === "/manga/all" && request.method === "GET") {
    try {
      const result = await Products.getAll()
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(success("Successfully got all products", JSON.parse(result.data)))
        )
        return response.end()
      }
      else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(failure("Failed to get products"))
        )
        return response.end()
      }
    }
    catch (error) {
      // console.log(error)
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(
        JSON.stringify(failure("Internal Server Error"))
      )
      return response.end()
    }
  }

  //get one by id
  else if (requestURL === "/manga/getone" && request.method === "GET") {
    try {
      const result = await Products.getOneById(20)
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(success("Successfully got the product", JSON.parse(result.data)))
        )
        return response.end()
      }
      else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(failure("ID not found"))
        )
        return response.end()
      }
    }
    catch (error) {
      // console.log(error)
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(
        JSON.stringify(failure("Internal Server Error"))
      )
      return response.end()
    }
  }

  // Add something
  else if (requestURL === "/manga/create" && request.method === "POST") {
    try {
      let requestBody = ""

      request.on("data", (chunk) => {
        requestBody += chunk
      })

      request.on("end", async () => {
        const result = await Products.add(requestBody)

        if (result.success) {
          response.writeHead(200, { "Content-Type": "application/json" })
          response.write(
            JSON.stringify(success(result.message))
          )
        } else {
          response.writeHead(400, { "Content-Type": "application/json" })
          response.write(
            JSON.stringify(failure(result.message || "Could not add the manga"))
          )
        }
        response.end()
      })
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(
        JSON.stringify(failure("Internal Server Error"))
      )
      response.end()
    }
  }

  else {
    response.writeHead(405, { "Content-Type": "application/json" })
      response.write(
        JSON.stringify(failure("There might be some problem with the method or url you used."))
      )
      response.end()
  }

})

server.listen(8000, () => {
  console.log("Server is running on 8000...")
})