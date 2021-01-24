require('dotenv').config()
const server = require("./server")
const Websocket = require("ws")
const {setSearchRules, connectToTwitter, tweetStream} = require('./twitter')
const {jsonParser, logger, textExtractor, tweetCounter, stringParser} = require("./process-tweets")
const { pipeline, Transform } = require ("stream")
const {getSearchRules, deleteSearchRules, addSearchRules} = require('./search-rules')
const { v4 } = require('uuid')

// server HTTP
server.listen(3000)

// Envoyer des données au client via websocket
const wsServer = new Websocket.Server({ server })

wsServer.on("connection", async (client) => {
    const clientId = v4()
    console.log('Client ID', clientId)

    let ruleID

    /*const ruleID = await addSearchRules([
        {value: clientId, tag: clientId}
    ])*/

    client.on("message", async (message) => {
        console.log("new filter: ", message)
        deleteSearchRules([ruleID])
        ruleInfos = await addSearchRules([
            {value: message, tag: clientId}
        ])
        ruleID = ruleInfos.data[0].id
    })
    /*tweetStream.on("data", (chunk) => {
        client.send(chunk)
    })*/
    const checkResult = new Transform({
        writableObjectMode: true,
        readableObjectMode: true,

        transform(chunk, _, callback) {
            ruleID = parseInt(ruleID)
            console.log('passed ruleID ', ruleID)
            console.log('typeof ruleID ', typeof ruleID)
           chunk.matching_rules?.forEach((item) => {
               console.log('passed ruleID ', ruleID)
               console.log('passed item tag ', item.id)
               if(item.id === ruleID) {
                   console.log(chunk)
                   this.push(chunk)
               }
           })

            callback()
        }
    })

    const socketStream = Websocket.createWebSocketStream(client)
    pipeline(
        tweetStream,
        jsonParser,
        checkResult,
        stringParser,
        socketStream,
        (err) => {
            if (err) {
                console.error("pipeline error: ", err)
            } else {
                console.log("pipeline success")
            }
        }
    )
})

// Connexion API Twitter
connectToTwitter()

// Vider puis ajouter les filtres
async function resetRules() {
    const existingRules = await getSearchRules()
    const ids = existingRules?.data?.map(rule => rule.id)
    if (ids) {
        deleteSearchRules(ids)
    }
}

// Règles de filtrage pour les tweets
/*getSearchRules()
    .then((rules) => {
        console.log(rules)

        // Supprimer les tweets
        const ids = rules?.data?.map(rule => rule.id)
        if (ids) {
            deleteSearchRules(ids)
        }
    })*/

/*resetRules()
    .then(() => {
        addSearchRules([
            {value: "arbre", tag: "arbre"}
        ])
    })*/



/*setSearchRules([
    {value: "cat has:images", tag: "cat pictures"},
    {value: "koala has:images", tag: "koala pictures"},
])*/

/*// Traiter les tweets (via transform)
pipeline(
    tweetStream,
    jsonParser,
    logger,
    toClient,
    (err) => {
        if (err) {
            console.error(err)
        }
    }
)*/
