const server = require("./server")
const {connectToTwitter, tweetStream} = require('./twitter')
const {jsonParser, logger} = require("./process-tweets")
const { pipeline } = require ("stream")

// server HTTP
server.listen(3000)

// Connexion API Twitter
connectToTwitter()

// Traiter les tweets (via transform)
pipeline(
    tweetStream,
    jsonParser,
    logger,
    //toClient,
    (err) => {
        if (err) {
            console.error(err)
        }
    }
)

// Envoyer des données au client via websocket
