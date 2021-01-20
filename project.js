const server = require("./server")
const Websocket = require("ws")
const {connectToTwitter, tweetStream} = require('./twitter')
const {jsonParser, logger} = require("./process-tweets")
const { pipeline } = require ("stream")

// server HTTP
server.listen(3000)

// Envoyer des données au client via websocket
const wsServer = new Websocket.Server({ server })

wsServer.on("connection", (client) => {
    console.log('new connection', client)

    client.on("message", (message) => {
        console.log("message from the client: ", message)

        client.send('Salut les clients')
    })
})


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
