const { Readable, pipeline, Writable, Transform } = require("stream")

const jsonParser = new Transform({
    readableObjectMode: true,

    transform(chunk, _, callback) {
        let data = {}

        try {
            //console.log(chunk.toString())
            data = JSON.parse(chunk.toString())
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
    write(chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (error) {

        }
        callback()
    }
})

const textExtractor = new Transform({
    writableObjectMode: true,

    transform(chunk, _, callback) {
        console.log(chunk.data)
        const text = chunk.data.text + " "

        this.push(text)

        callback()
    }
})

const ppExtractor = new Transform({
    writableObjectMode: true,

    transform(chunk, _, callback) {
        const text = chunk.data.text + " "

        this.push(text)

        callback()
    }
})

const tweetCounter = new Transform({
    transform(chunk, _, callback) {
        this.counter++

        this.push(this.counter.toString())

        callback()
    }
})
tweetCounter.counter = 0;

const stringParser = new Transform({
    writableObjectMode: true,

    transform(chunk, _, callback) {
        this.push(JSON.stringify(chunk))

        callback()
    }
})

module.exports = {
    jsonParser,
    textExtractor,
    logger,
    tweetCounter,
    stringParser,
}