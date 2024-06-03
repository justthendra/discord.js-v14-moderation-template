const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription("Sets the slowmode forr the current channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(seconds =>
        seconds.setName('seconds')
        .setDescription("The number of seconds for slowmode.")
        .setRequired(true)
    ),
    async execute(interaction) {
        
        const seconds = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(seconds, "Slowmode set by " + interaction.user.username);
            interaction.reply({content: `Slowmode is now set to ${seconds} seconds.`})
        } catch (err) {
            console.error(err)
        }
    }
}