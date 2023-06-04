const { Interaction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        switch (true) {
            case interaction.isCommand():
                return await CommandHandler(interaction, client);
            case interaction.isButton():
                return await ButtonHandler(interaction, client);
            default:
                return await interaction.reply({
                    content: `I don't know how to handle this interaction!`,
                    ephemeral: true
                });
        }

    },
};




async function CommandHandler(interaction, client) {
    console.log(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);
    if (!command) return await interaction.reply({
        content: `I don't know how to handle this command!\n\`\`\`Error: Command not found\`\`\``,
        ephemeral: true
    });
    
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.log(`${client.colors.red}${error.stack}${client.colors.reset}`);
        await interaction.reply({
            content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``, 
            ephemeral: true
        }).catch( () => {} );
    }
}



async function ButtonHandler(interaction, client) {
    console.log(`${interaction.user.tag} (${interaction.user.id}) > [${interaction.customId}]`);

    const args = interaction.customId.split('_');

    // Use the first arg as the command name, the other args are to pass data between the button and the command
    // ex. CustomID : 'test_123_456_789' => args : ['test', '123', '456', '789']

    switch (args[0]) {
        case 'test':
            return await interaction.reply({
                content: 'test',
                ephemeral: true
            });
        default:
            return await interaction.reply({
                content: `I don't know how to handle this button!\n\`\`\`Error: Button not found\`\`\``,
                ephemeral: true
            }).catch( () => {} );
    }
}