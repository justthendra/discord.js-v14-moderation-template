const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("You unlock the channel you specified.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {

        interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true
        });

        const lockEmb = new EmbedBuilder()
        .setAuthor({ name: "Channel is unlocked.", iconURL: interaction.user.displayAvatarURL()})
        .setDescription(`${interaction.channel} named channel is unlocked. Now anyone can send a message to the channel.!\n\n**Author**: ${interaction.user.username}`)
        .setColor("Random")
        .setFooter({ text: "Discord.js v14 Moderation Bot | Un-lock", iconURL: interaction.user.displayAvatarURL()})
        .setTitle("Discord.js v14 Moderation")
        .setTimestamp()
        .setURL(config.embeds.ytUrl)
        interaction.reply({embeds: [lockEmb]})
    }
}