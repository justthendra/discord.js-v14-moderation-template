const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Show a bot message ping.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        interaction.reply({ content: `My ping is \`${interaction.client.ws.ping}\``});
    }
}