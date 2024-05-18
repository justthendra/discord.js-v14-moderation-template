const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Specify a person ban the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
        option.setName('user')
        .setDescription('Specify a user.')
        .setRequired(true))
    .addStringOption(reason => 
        reason.setName('reason')
        .setDescription("Specify a reason.")),
    async execute(interaction) {
                
                const user = interaction.options.getMember('user');
                const reason = interaction.options.getString('reason');

                const banEmbed = new EmbedBuilder()
                .setTitle('Discord.js v14 Moderation')
                .setColor(config.embeds.colorSuccessfull)
                .setAuthor({name: "A user has been banned."})
                .setDescription(`The user named ${user} was banned from the server for \`${reason}\`.`)
                .setTimestamp()
                .setFooter({text: "Discord.js v14 Moderation Bot | Ban Command", iconURL: interaction.client.user.displayAvatarURL()})
                .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")
                interaction.reply({embeds: [banEmbed]})
                interaction.guild.members.ban(user, { reason: reason })


                const logEmbed = new EmbedBuilder()
                .setTitle('Discord.js v14 Moderation')
                .setColor(config.embeds.colorSuccessfull)
                .setAuthor({name: "A user has been banned."})
                .setDescription(`The user named ${user} was banned from the server for \`${reason}\`.`)
                .setTimestamp()
                .setFooter({text: "Discord.js v14 Moderation Bot | Ban Command", iconURL: interaction.client.user.displayAvatarURL()})
                .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")

                const channelID = config.guild.channels.modlog;
                const channel = interaction.guild.channels.cache.find(channell => channell.id === channelID)
                channel.send({embeds: [logEmbed]})
            }
}