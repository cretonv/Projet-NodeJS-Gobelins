const { Readable, pipeline, Writable, Transform } = require("stream")
const http = require("https")
const needle = require("needle")

const TWT_API_HOST = "api.twitter.com"
const TWT_API_PATH = "/2/tweets/samples/stream?tweet.fields=attachments,author_id,geo&expansions=author_id,user.fields,attachments.media_keys&media.fields=url"
const TWT_API_SEARCH_PATH = "/2/tweets/search/stream?tweet.fields=author_id&expansions=author_id&user.fields=profile_image_url"
const TWT_API_RULES_PATH = "/2/tweets/search/stream/rules"
const BEARER_TOKEN = process.env.TWT_BEARER_TOKEN

const options = {
    host: TWT_API_HOST,
    headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + BEARER_TOKEN
    },

}

const tweetStream = new Readable({
    read() {}
})

function connectToTwitter() {
    const opts = {
        ...options,
        path: TWT_API_SEARCH_PATH,
        method: "GET",
    }
    const req = http.request(opts, (response) => {
        response.on('data', (chunk => {
            // console.log("data: ", chunk.toString())
            tweetStream.push(chunk)
        }))
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.end()
}

function setSearchRules(rules) {
    const opts = {
        ...options,
        path: TWT_API_RULES_PATH,
        method: "POST",
    }
    const data = JSON.stringify({
        add: rules
    })

    const req = http.request(opts, (res) => {
        let data
        res.on("data", (chunk) => {
            data += chunk
        })
        res.on("end", (chunk) => {
            console.log("twt api response: ", data)
        })
    })

    req.write(data)
    req.end()
}

module.exports = {
    tweetStream,
    connectToTwitter,
    setSearchRules
}