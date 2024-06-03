const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("You lock the channel you specified.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {

        interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            ViewChannel: true,
            SendMessages: false,
            ReadMessageHistory: true,
            AttachFiles: false
        });

        const lockEmb = new EmbedBuilder()
        .setAuthor({ name: "Channel is locked.", iconURL: interaction.user.displayAvatarURL()})
        .setDescription(`${interaction.channel} named channel is locked. No one can send messages to the channel anymore!\n\n**Author**: ${interaction.user.username}`)
        .setColor("Random")
        .setFooter({ text: "Discord.js v14 Moderation Bot | Lock", iconURL: interaction.user.displayAvatarURL()})
        .setTitle("Discord.js v14 Moderation")
        .setTimestamp()
        .setURL(config.embeds.ytUrl)
        interaction.reply({embeds: [lockEmb]})
    }
}