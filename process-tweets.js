const { Readable, pipeline, Writable, Transform } = require("stream")

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
    write(chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (error) {

        }
        callback()
    }
})

module.exports = {
    jsonParser,
    logger
}