// Require dependencies
const fetch = require('node-fetch');
const { mkdirSync, writeFileSync } = require('fs');

// Require configuration
const { outputFolder, botToken } = require('./config.json');

// Require constants
const { DISCORD_API_BASE_URL, ENDPOINTS } = require('./constants.js');

function FetchStickersPacks() {
    return new Promise( (resolve, reject) => {
        fetch(`${DISCORD_API_BASE_URL}${ENDPOINTS.STICKERS}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bot ${botToken}`
            }
        }).then( (res) => {
            if (res.status !== 200) {

                reject(`Discord API returned status code ${res.status}. Make sure your bot token is valid.`);
            } else {

                res.json().then( (result) => {
                    resolve(result.stickers_packs)
                })
            }
        })
    })
}