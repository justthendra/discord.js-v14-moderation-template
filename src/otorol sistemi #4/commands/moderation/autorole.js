const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const roleDatas = require('../../models/role');
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("You set the autorole for new members joining the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
        option.setName("role")
        .setDescription("Specify a role.")
        .setRequired(true)
    ),
    async execute(interaction) {
        const role = interaction.options.getRole('role')

        const roleData = await roleDatas.findOne({ guildId: interaction.guild.id })

        if (!roleData) {
            new roleDatas({
                guildId: interaction.guild.id,
                roleId: role.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Moderation')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Autorole has been set successfully."})
            .setDescription(`Autorole has been successfully set to ${role}.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Moderation Bot | Autorole Command", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.ytUrl)
            interaction.reply({embeds: [emb]})
        }

        if(roleData) {

            await roleDatas.findOneAndUpdate({
                roleId: role.id
            });

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Moderation')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Autorole has been updated successfully."})
            .setDescription(`Autorole has been successfully updated to ${role}.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Moderation Bot | Autorole Command", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.ytUrl)
            interaction.reply({embeds: [emb]})
        }
    }
}