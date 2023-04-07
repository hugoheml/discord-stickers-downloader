# Discord Stickers Saver
This is a small project, which allows you to **download all the Discord nitro stickers** from Discord API.

## Warning
I am aware that **it takes a long time to download**, but as Discord uses specific formats, I need to convert them to download them as a gif.

Feel free to [contribute](#contributions-questions-and-problems) if you have any ideas for optimization!

## Requirements
- NodeJS
- NPM

## Usage
- Clone or download the project
- Install [Gifski CLI](https://github.com/sindresorhus/Gifski), used by [puppeteer-lottie](https://github.com/transitive-bullshit/puppeteer-lottie)
- Download dependencies with `npm install` command in your terminal
- Duplicate `config-example.json` as `config.json`
- Configure the script (follow [Configuration](#configuration) section for more details)
- Run the script with `node index.js` command

## Configuration
Before configurate the script, you need to duplicate the `config-example.json` as `config.json`.

All settings are detailed here:
- `outputFolder`: The folder which your Discord Stickers will be download into (from the script folder)
- `botToken`: The token of a Discord Bot (used to interact with Discord API)
- `informations`:
    - `packs` If you want to view packs download progression in your console
    - `stickers` If you want to view stickers download progression in your console

## Contributions, questions and problems
If you have any questions or problems, you can do an issue.

If you want to contribute to the script, you can create an issue or clone a project and create a pull request.