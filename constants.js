module.exports = {
    DISCORD_API_BASE_URL: 'https://discord.com/api/v10',
    ENDPOINTS: {
        STICKERS: '/sticker-packs',
    },
    INFORMATIONS_FILE_NAME: "data.json",
    STICKER_DOWNLOAD_URL: (_packId, stickerId, extension) => `https://media.discordapp.net/stickers/${stickerId}.${extension}`,
    LOTTIE_STICKER_DATA_URL: (_packId, stickerId) => `https://discord.com/stickers/${stickerId}.json`,
    STICKERS_FORMAT_EXTENSIONS: {
        1: 'png',
        2: 'png',
        3: 'png',
        4: 'gif'
    },
    LOTTIE_STICKER_FORMAT_TYPE: 3,
    WAIT_TIME: 100
}