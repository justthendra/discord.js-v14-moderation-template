const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

function parseDuration(duration) {
    const regex = /(\d+)([smhd])/;
    const matches = duration.match(regex);

    if (!matches) return null;

    const [, value, unit] = matches;

    switch (unit) {
        case 's':
            return parseInt(value);
        case 'm':
            return parseInt(value) * 60;
        case 'h':
            return parseInt(value) * 60 * 60;
        case 'd':
            return parseInt(value) * 60 * 60 * 24;
        default: 
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('You timeout a user of your choice.')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(user =>
        user.setName('user')
        .setDescription('Specify a user.')
        .setRequired(true))
    .addStringOption(duration => 
        duration.setName('duration')
        .setDescription('Specify a duration. (30m, 1h, 2h)')
        .setRequired(true)),
    async execute(interaction) {

        const user = interaction.options.getMember('user')
        const durationString = interaction.options.getString('duration')
        const duration = parseDuration(durationString);

        const muteEmbed = new EmbedBuilder()
        .setTitle('Discord.js v14 Moderation')
        .setAuthor({name: "A user has been applied timeout."})
        .setDescription(`A timeout has been applied to user ${user}\nDuration: \`${durationString}\``)
        .setColor(config.embeds.colorSuccessfull)
        .setTimestamp()
        .setFooter({text: "Discord.js v14 Moderation Bot | Timeout Command", iconURL: interaction.client.user.displayAvatarURL()})
        .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")
        interaction.reply({embeds: [muteEmbed]})
        await user.timeout(duration * 1000)
        

        const logEmbed = new EmbedBuilder()
        .setTitle('Discord.js v14 Moderation')
        .setAuthor({name: "A user has been applied timeout."})
        .setDescription(`A timeout has been applied to user ${user}\nDuration: \`${durationString}\``)
        .setColor(config.embeds.colorSuccessfull)
        .setTimestamp()
        .setFooter({text: "Discord.js v14 Moderation Bot | Timeout Command", iconURL: interaction.client.user.displayAvatarURL()})
        .setURL("https://github.com/justthendra/discord.js-v14-moderation-template")

        const channelID = config.guild.channels.modlog;
        const channel = interaction.guild.channels.cache.find(channell => channell.id === channelID)
        channel.send({embeds: [logEmbed]})
    }
}