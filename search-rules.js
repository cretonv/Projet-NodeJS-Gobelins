const needle = require("needle")

const URL = 'https://api.twitter.com/2/tweets/search/stream/rules'

async function getSearchRules() {
    const response = await needle('get', URL, {
        headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${process.env.TWT_BEARER_TOKEN}`
        }
    })

    return response.body
}

async function deleteSearchRules(ids) {
    const data = {
        delete: {
            ids
        }
    }

    const response = await needle(
        'post',
        URL,
        data,
        {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${process.env.TWT_BEARER_TOKEN}`
            }
        }
    )

    console.log("Delete rules: ", response.body)
}

async function addSearchRules(rules) {
    const data = {
        add: rules
    }

    const response = await needle(
        'post',
        URL,
        data,
        {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${process.env.TWT_BEARER_TOKEN}`
            }
        }
    )

    console.log("addRules: ", response.body)
    return response.body
}

module.exports = {
    addSearchRules,
    getSearchRules,
    deleteSearchRules
}