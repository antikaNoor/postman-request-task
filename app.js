const http = require("http")
const { success, failure } = require("./utils/success-error")
const Products = require("./model/products")
const path = require("path")

const server = http.createServer(async (request, response) => {
  const requestURL = request.url.split("?")[0]
  // The queryParam function
  const getQueryParams = () => {
    const urlParts = request.url.split("?")
    if (urlParts.length < 2) {
      return null
    }

    // Getting the part that comes after ?
    const params = new URLSearchParams(urlParts[1])
    const queryParams = {}
    for (const [param, value] of params) {
      queryParams[param] = value
    }
    return queryParams
  }
  // calling the getQueryParams
  const queryParams = getQueryParams()

  // get all
  if (requestURL === "/manga/all" && request.method === "GET") {
    try {
      const result = await Products.getAll()
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(
            success("Successfully got all products", JSON.parse(result.data))
          )
        )
        return response.end()
      } else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(JSON.stringify(failure("Failed to get products")))
        return response.end()
      }
    } catch (error) {
      // console.log(error)
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(JSON.stringify(failure("Internal Server Error")))
      return response.end()
    }
  }

  // get by stock and price
  if (requestURL === "/manga/stockandprice" && request.method === "GET") {
    try {
      const result = await Products.getByPriceAndStock(parseInt(queryParams.stock), parseFloat(queryParams.price))
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(
            success("Successfully got all products", JSON.parse(result.data))
          )
        )
        return response.end()
      } else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(JSON.stringify(failure("Failed to get products")))
        return response.end()
      }
    } catch (error) {
      // console.log(error)
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(JSON.stringify(failure("Internal Server Error")))
      return response.end()
    }
  }

  //get one by id
  else if (requestURL === "/manga/detail" && request.method === "GET") {
    try {
      const result = await Products.getOneById(parseInt(queryParams.id))

      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(success(result.message, JSON.parse(result.data)))
        )
        return response.end()
      } else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(JSON.stringify(failure(result.message)))
        return response.end()
      }
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(JSON.stringify(failure("Internal Server Error")))
      return response.end()
    }
  }

  //delete one by id
  else if (requestURL === "/manga/delete" && request.method === "DELETE") {
    try {
      const idToDelete = parseInt(queryParams.id)

      const result = await Products.deleteOneById(idToDelete)
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(
          JSON.stringify(success(result.message, JSON.parse(result.data)))
        )
        return response.end()
      } else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(JSON.stringify(failure(result.message)))
        return response.end()
      }
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(JSON.stringify(failure("Internal Server Error")))
      return response.end()
    }
  }

  // Update something
  else if (requestURL === "/manga/up" && request.method === "PUT") {
    try {
      let requestBody = ""

      request.on("data", (chunk) => {
        requestBody += chunk
      })

      request.on("end", async () => {
        const result = await Products.updateOneById(
          parseInt(queryParams.id),
          JSON.parse(requestBody)
        )
        if (result.success) {
          response.writeHead(200, { "Content-Type": "application/json" })
          response.write(JSON.stringify(success(result.message)))
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
      response.write(JSON.stringify(failure("Internal Server Error")))
      response.end()
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
          response.write(JSON.stringify(success(result.message)))
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
      response.write(JSON.stringify(failure("Internal Server Error")))
      response.end()
    }
  }

  // Sort data by id
  else if (requestURL === "/manga/sortbyid" && request.method === "GET") {
    try {
      const result = await Products.sortDataById()
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify(success(result.message)))
      } else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(JSON.stringify(failure(result.message)))
      }
      response.end()
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(JSON.stringify(failure("Internal Server Error")))
      response.end()
    }
  }
  // Sort data by name
  else if (requestURL === "/manga/sortbyname" && request.method === "GET") {
    try {
      const result = await Products.sortDataByName()
      if (result.success) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify(success(result.message)))
      } else {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.write(JSON.stringify(failure(result.message)))
      }
      response.end()
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" })
      response.write(JSON.stringify(failure("Internal Server Error")))
      response.end()
    }
  } else {
    response.writeHead(405, { "Content-Type": "application/json" })
    response.write(
      JSON.stringify(
        failure("There might be some problem with the method or url you used.")
      )
    )
    response.end()
  }
})

server.listen(8000, () => {
  console.log("Server is running on 8000...")
})
