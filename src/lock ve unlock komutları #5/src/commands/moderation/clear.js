const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk delete messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption(number =>
        number.setName('value')
        .setDescription('Provide the amount of messages.')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)),
        async execute(interaction) {

            const amount = interaction.options.getNumber('value')
            const channelID = config.guild.channels.message;
            const channel = interaction.guild.channels.cache.find(channell => channell.id === channelID)

            interaction.reply(`${amount} of messages were deleted`).then(message => setTimeout(() => message.delete(), 5000))
            interaction.channel.bulkDelete(amount);

            const logEmbed = new EmbedBuilder()
            .setTitle('Discord.js v14 Moderation')
            .setAuthor({name: "A message deleted."})
            .setDescription(`\`${amount}\` of messages were deleted.\nChannel: ${interaction.channel}`)
            .setColor(config.embeds.colorDefault)
            .setFooter({text: "Discord.js v14 Moderation Bot | Clear Command", iconURL: interaction.client.user.displayAvatarURL()})
            .setTimestamp()
            .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")
            channel.send({embeds: [logEmbed]})
        }
}