const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require("discord.js")
const config = require("./config.json")

const fs = require('node:fs');
const path = require('node:path')
require('cute-logs')

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
const foldersPath = path.join(__dirname, './src/commands');
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
			console.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
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
			console.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(config.bot.token);

(async () => {
	try {
		console.info(`Started refreshing ${commands.length} application (/) commands.`, 'Commands');

		
		const data = await rest.put(
			Routes.applicationCommands(config.bot.client_id),
			{ body: commands },
		);

		console.info(`Successfully reloaded ${data.length} application (/) commands.`, 'Commands');
	} catch (error) {
		
		console.error(error, 'Bot');
	}
})();

const eventsPath = path.join(__dirname, './src/events');
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

const Role = require('./src/models/role')

client.on('guildMemberAdd', async member => {
	const roleData = await Role.findOne({ guildId: member.guild.id });

	if (roleData) {
		const role = member.guild.roles.cache.get(roleData.roleId)

		if(role) {
			await member.roles.add(role);
			const channell = config.guild.channels.logins;
			const channel = client.channels.cache.find(cha => cha.id === channell)

			const logEmb = new EmbedBuilder()
			.setTitle("Discord.js v14 Moderation")
			.setAuthor({name: "A user has joined the server."})
			.setDescription(`Assigned role ${role} to \`${member.user.username}\``)
			.setColor(config.embeds.colorSuccessfull)
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
});

client.login(config.bot.token)