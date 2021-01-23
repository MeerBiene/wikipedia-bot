require('dotenv').config()

const { DiscordInteractions }  = require("slash-commands");

const config = {
    applicationId: process.env.BOT_ID,
    authToken: process.env.DISCORD_TOKEN,
    publicKey: process.env.PUBLIC_KEY
}


const interaction = new DiscordInteractions(config)

// import the wiki command
const { wiki } = require('./commands/wiki');

async function main() {
    // Create Global Command
  await interaction
  .createApplicationCommand(wiki)
  .then(console.log)
  .catch(console.error);
}

main();