const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

if (!process.env.token || !process.env.clientID) {
    console.log('Please provide a token and a clientID in the .env file');
    process.exit(1);
}

if (process.env.token.startsWith('PASTE') || process.env.clientID.startsWith('PASTE')) {
    console.log('Please provide a token and a clientID in the .env file');
    process.exit(1);
}

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            
            if (!commandFiles.length) {
                console.log(`${client.color.yellow}No commands found in ${folder}${client.color.reset}`);
                continue;
            }

            for (const file of commandFiles) {
                console.log(`${client.color.blue}Reading command ${file} ...${client.color.reset}`);
            
                try {
                    const command = require(`../commands/${folder}/${file}`);
                    client.commands.set(command.data.name, command);
                    client.commandArray.push(command.data.toJSON());
                } catch (error) {
                    console.log(`${client.color.red}Error while loading command ${file}${client.color.reset}`);
                    console.log(`${client.color.red}${error.stack}${client.color.reset}`);
                }
            
            }
        }

        const rest = new REST({
            version: '10'
        }).setToken(process.env.token);

        ( () => {
            try {
                console.log('Started refreshing application (/) commands.');

                rest.put(
                    Routes.applicationCommands(process.env.clientID), {
                        body: client.commandArray
                    },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};