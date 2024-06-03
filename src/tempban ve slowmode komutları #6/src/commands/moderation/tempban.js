const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Temporarily bans a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(user =>
        user.setName("target")
        .setDescription("Specify a user to ban")
        .setRequired(true)
    )
    .addIntegerOption(minutes =>
        minutes.setName("minutes")
        .setDescription("Ban duration in minutes")
        .setRequired(true)
    )
    .addStringOption(reason =>
        reason.setName("reason")
        .setDescription("Reason for the ban.")
    ),
    async execute(interaction) {
        await interaction.deferReply()

        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || "No reason provided";

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) return interaction.reply({ content: "User not found in this server."})

        try {
            await member.ban({ reason });
            const banEmb = new EmbedBuilder()
            .setAuthor({name: "A user has been banned."})
            .setColor("Random")
            .setDescription(`\`${target.username}\` has been banned for \`${duration}\` minutes. Reason: \`${reason}\``)
            .setTitle("Discord.js v14 Moderation")
            .setFooter({text: "Discord.js v14 Moderation Bot | Tempban", iconURL: interaction.client.user.displayAvatarURL()})
            .setTimestamp()
            .setURL(config.embeds.ytUrl)
            interaction.editReply({embeds: [banEmb]})

            setTimeout(async () => {
                await interaction.guild.members.unban(target.id, "Temporary ban duration expired");

                const unbanEmb = new EmbedBuilder()
                .setAuthor({name: "A user has been unbanned."})
                .setColor("Random")
                .setDescription(`\`${target.username}\` has been unbanned.`)
                .setTitle("Discord.js v14 Moderation")
                .setFooter({text: "Discord.js v14 Moderation Bot | Tempban", iconURL: interaction.client.user.displayAvatarURL()})
                .setTimestamp()
                .setURL(config.embeds.ytUrl)
                interaction.editReply({embeds: [unbanEmb]}) 
            }, duration * 60 * 1000)
        } catch (error) {
            console.error(error)
        }
    }
}