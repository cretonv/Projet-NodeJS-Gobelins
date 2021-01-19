const http = require("https")

const TWT_API_HOST = "api.twitter.com"
const TWT_API_PATH = "/2/tweets/sample/stream"
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAKWyLwEAAAAA2el4qPKqnO8lHf2VStQiCYN2%2F3U%3Dxi3ZLYejFMrNmnHWrN95RT1iNXo5QXk0DzgFaszDT0qPUcsBnS"

const options = {
    host: TWT_API_HOST,
    path: TWT_API_PATH,
    method: "GET",
    headers: {
        Authorization: "Bearer " + BEARER_TOKEN
    }
}

const req = http.request(options, (response) => {
    response.on('data', (chunk => {
        console.log("data: ", chunk.toString())
    }))
})

req.on('error', (error) => {
    console.error(error)
})

req.end()