const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('It removes the ban of the user whose id you entered.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(id => 
        id.setName('id')
        .setDescription('Specify a user id.')
        .setRequired(true)),
        async execute(interaction) {

            const user = interaction.options.getString('id');

            const unbanEmbed = new EmbedBuilder()
            .setTitle('Discord.js v14 Moderation')
            .setAuthor({name: "A user has been unbanned."})
            .setDescription(`The server ban of the user with id \`${user}\` has been removed.`)
            .setColor(config.embeds.colorSuccessfull)
            .setFooter({text: "Discord.js v14 Moderation Bot | Unban Command", iconURL: interaction.client.user.displayAvatarURL()})
            .setTimestamp()
            .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")
            interaction.reply({embeds: [unbanEmbed]})
            interaction.guild.members.unban(user)

            const logEmbed = new EmbedBuilder()
            .setTitle('Discord.js v14 Moderation')
            .setAuthor({name: "A user has been unbanned."})
            .setDescription(`The server ban of the user with id \`${user}\` has been removed.`)
            .setColor(config.embeds.colorSuccessfull)
            .setFooter({text: "Discord.js v14 Moderation Bot | Unban Command", iconURL: interaction.client.user.displayAvatarURL()})
            .setTimestamp()
            .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")

            const channelID = config.guild.channels.modlog;
            const channel = interaction.guild.channels.cache.find(chanell => chanell.id === channelID);
            channel.send({embeds: [logEmbed]})
        }
}