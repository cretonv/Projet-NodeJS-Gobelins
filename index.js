const http = require("https")
const { Readable, pipeline, Writable, Transform } = require("stream")

const TWT_API_HOST = "api.twitter.com"
const TWT_API_PATH = "/2/tweets/sample/stream?tweet.fields=attachments,author_id,geo&expansions=author_id,attachments.media_keys&media.fields=url"
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAKWyLwEAAAAA2el4qPKqnO8lHf2VStQiCYN2%2F3U%3Dxi3ZLYejFMrNmnHWrN95RT1iNXo5QXk0DzgFaszDT0qPUcsBnS"

const options = {
    host: TWT_API_HOST,
    path: TWT_API_PATH,
    method: "GET",
    headers: {
        Authorization: "Bearer " + BEARER_TOKEN
    }
}

const tweetStream = new Readable({
  read() {}
})

const jsonParser = new Transform({
    readableObjectMode: true,

    transform(chunk, _, callback) {
        let data = {}

        try {
            data = JSON.parse(chunk)
        } catch (error){
            console.log(error)
        }

        if (data) {
            this.push(data)
        }
        callback()
    }
})

const logger = new Writable({
    objectMode: true,
    write (chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (error) {

        }
        callback()
    }
})

const req = http.request(options, (response) => {
    response.on('data', (chunk => {
        // console.log("data: ", chunk.toString())
        tweetStream.push(chunk)
    }))
})

req.on('error', (error) => {
    console.error(error)
})

req.end()

pipeline(
    tweetStream,
    jsonParser,
    logger,
    //toClient,
    (err) => {
        console.error(err)
    }
)