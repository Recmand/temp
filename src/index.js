const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
}); 

client.commands = new Collection();
client.color = require('./colors.js').color;

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    console.log(`Logging in ...`);
    client.login(process.env.token);
})();

