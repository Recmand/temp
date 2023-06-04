const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command'),
    async execute(interaction, client) {

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test')
                    .setLabel('Test')
                    .setStyle('Primary')
            );

        await interaction.reply({
            content: 'Test',
            components: [button]
        });

    },
};