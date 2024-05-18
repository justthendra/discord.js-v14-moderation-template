const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require("discord.js")
const config = require("./config.json")

const fs = require('node:fs');
const path = require('node:path')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    shards: "auto",
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const { REST, Routes } = require('discord.js');

const commands = [];

for (const folder of commandFolders) {
	
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(config.bot.token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		
		const data = await rest.put(
			Routes.applicationCommands(config.bot.client_id),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		
		console.error(error);
	}
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const mongoose = require('mongoose')
const Role = require('./models/role');

client.on('guildMemberAdd', async member => {
	const roleInfo = await Role.findOne({ guildId: member.guild.id });
	if (roleInfo) {
		const role = member.guild.roles.cache.get(roleInfo.roleId)
		if (role) {
			await member.roles.add(role);
			const channell = config.guild.channels.logins;
			const channel = client.channels.cache.find(ch => ch.id === channell)

			const logEmb = new EmbedBuilder()
			.setTitle('Discord.js v14 Moderation')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "A user has joined the server."})
            .setDescription(`Assigned role ${role} to \`${member.user.username}\`.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Moderation Bot | Autorole", iconURL: client.user.displayAvatarURL()})
            .setURL(config.embeds.ytUrl)

			channel.send({embeds: [logEmb]})
		} 
	}
})

module.exports = client;

process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
})

client.login(config.bot.token)