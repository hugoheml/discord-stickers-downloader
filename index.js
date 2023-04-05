// Require dependencies
const fetch = require('node-fetch');
const { mkdirSync, writeFileSync } = require('fs');
const renderLottie = require('puppeteer-lottie');

// Require configuration
const { outputFolder, botToken, informations } = require('./config.json');

// Require constants
const { DISCORD_API_BASE_URL, ENDPOINTS, INFORMATIONS_FILE_NAME, STICKERS_FORMAT_EXTENSIONS, LOTTIE_STICKER_FORMAT_TYPE, WAIT_TIME, LOTTIE_STICKER_DATA_URL } = require('./constants.js');
const { STICKER_DOWNLOAD_URL }=require('./constants.js');

function Wait() {
    return new Promise( (resolve) => {
        setTimeout( () => {
            resolve();
        }, WAIT_TIME);
    })
}

function FetchStickersPacks() {
    return new Promise( (resolve, reject) => {
        fetch(`${DISCORD_API_BASE_URL}${ENDPOINTS.STICKERS}`, {
            method: "GET",
            headers: {
                "Authorization": `Bot ${botToken}`
            }
        }).then( (res) => {
            if (res.status !== 200) {

                reject(`Discord API returned status code ${res.status}. Make sure your bot token is valid.`);
            } else {

                res.json().then( (result) => {
                    resolve(result?.sticker_packs ?? []);
                })
            }
        })
    })
}

function DownloadStickers() {
    FetchStickersPacks().then( async (packs) => {
        for await (const pack of packs) {
            // Create pack folder
            const formatedPackName = pack.name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-").toLowerCase();
            mkdirSync(`${outputFolder}/${formatedPackName}`, { recursive: true });
            
            if (informations.packs) {
                writeFileSync(`${outputFolder}/${formatedPackName}/${INFORMATIONS_FILE_NAME}`, JSON.stringify({
                    id: pack.id,
                    name: pack.name,
                    description: pack.description,
                    sku_id: pack.sku_id,
                    cover_sticker_id: pack.cover_sticker_id,
                    banner_asset_id: pack.banner_asset_id
                }, null, 4));
            }

            let i = 0;
            for await (const sticker of pack.stickers) {
                i++;

                const mediaExtension = STICKERS_FORMAT_EXTENSIONS[sticker.format_type];
                if (!mediaExtension) {
                    console.log(`Format type ${sticker.format_type} is not supported. Aborting download for ${sticker.name}`);
                    return;
                }

                // Create sticker folder
                const formatedStickerName = sticker.name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-").toLowerCase();
                mkdirSync(`${outputFolder}/${formatedPackName}/${formatedStickerName}`, { recursive: true });

                if (informations.stickers) {
                    writeFileSync(`${outputFolder}/${formatedPackName}/${formatedStickerName}/${INFORMATIONS_FILE_NAME}`, JSON.stringify({
                        id: sticker.id,
                        name: sticker.name,
                        description: sticker.description,
                        tags: sticker.tags.split(', '),
                        type: sticker.type,
                        format_type: sticker.format_type,
                        asset: sticker.asset,
                        pack_id: sticker.pack_id,
                        sort_value: sticker.sort_value
                    }, null, 4));
                }
                
                if (sticker.format_type === LOTTIE_STICKER_FORMAT_TYPE) {

                    const res = await fetch(LOTTIE_STICKER_DATA_URL(sticker.pack_id, sticker.id), {
                        method: "GET",
                    })

                    if (res.status !== 200) {
                        console.log(`Discord API returned status code ${res.status}. Aborting download of ${sticker.name}...`);
                    } else {

                        const json = await res.json();
                        const jsonPath = `${outputFolder}/${formatedPackName}/${formatedStickerName}/sticker.json`;

                        writeFileSync(jsonPath, JSON.stringify(json, null, 4));
                        
                        await renderLottie({
                            path: jsonPath,
                            output: `${outputFolder}/${formatedPackName}/${formatedStickerName}/sticker.gif`,
                            quiet: true
                        })

                        console.log(`${i}/${pack.stickers.length} Downloaded ${sticker.name}!`)
                    }

                    await Wait();
                } else {

                    const res = await fetch(STICKER_DOWNLOAD_URL(sticker.pack_id, sticker.id, mediaExtension), {
                        method: "GET",
                    })

                    if (res.status !== 200) {
                        console.log(`Discord Media CDN returned status code ${res.status}. Aborting download of ${sticker.name}...`);
                    } else {
                        const buffer = await res.buffer()
                        writeFileSync(`${outputFolder}/${formatedPackName}/${formatedStickerName}/sticker.${mediaExtension}`, buffer);

                        console.log(`${i}/${pack.stickers.length} Downloaded ${sticker.name}!`)
                    }

                    await Wait();
                }
            }
        }
    })
}
DownloadStickers();