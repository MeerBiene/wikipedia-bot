require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js-light')
if (process.version.slice(1).split('.')[0] < 12) {
	console.error('Node 12.0.0 or higher is required. Please upgrade Node.js on your computer / server.')
	process.exit(1)
}

const Keyv = require('keyv');
if (!fs.existsSync('./data/prefixes.sqlite')) return console.error('The prefix database file doesnt exist in the ./data directory')
const prefixcache = new Keyv('sqlite://data/prefixes.sqlite')

const client = new Discord.Client({ 
	disableMentions: 'everyone', 
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	cacheGuilds: true,
    cacheChannels: true,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
    cachePresences: false
});

const config = {
	ENVIRONMENT: process.env.NODE_ENV,
	DEFAULTPREFIX: process.env.DEFAULTPREFIX,
	VERSION: process.env.VERSION,
	TOKEN: process.env.DISCORD_TOKEN,
}

// Modules
require('./modules/embeds')(client);
require('./modules/wikifunctions')(client);
const Logger = new (require('./modules/util')).Logger()
const BotListUpdater = require('./modules/bot-list-updater').BotListUpdater

let myShardId = undefined;

// Creating a collection for the commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	// Check if any alias does exist and add if they do
	if(command.alias) {
		for(const alias of command.alias) {
			client.commands.set(alias, command)
		}
	}
}

// Handling prefixcache errors.
prefixcache.on('error', e => Logger.error('There was an error with the keyv package, trace: ' + e))

// Sharding Events
client.on('shardReady', (id) => {
	Logger.info(`Shard ${id} is ready!`)
	myShardId = id;
})

client.on('shardDisconnect', (event, id) => Logger.info(`Shard ${id} disconnected and does not reconnect`))

client.on('shardError', (error, shardID) => Logger.error(`Shard ${shardID} encountered following error: ${error}`))

client.on('shardReconnecting', (id) => Logger.info(`Shard ${id} reconnected`))

client.on('shardResume', (id, replayedEvents) => Logger.info(`Shard ${id} resumed with ${replayedEvents} replayed events`))

client.on('disconnect', () => Logger.info('Disconnected!'))

// Handling client events
client.on('warn', console.warn)

client.on('error', console.error)

client.on('ready', async () => {

	Logger.info('\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version)
	Logger.info('This Bot is online and it is running on version: ' + config.VERSION)
	Logger.warn('The environment is currently set on ' + config.ENVIRONMENT)

	if (config.ENVIRONMENT === 'development') {

		client.user.setPresence({
			status: 'idle',
			activity: {
				name: `${config.DEFAULTPREFIX}help | ${await this.guildCount()} servers (${myShardId})`,
			},
		}).catch(e => {
			console.error(e)
		})


	}
	else {
		client.user.setPresence({
			status: 'online',
			activity: {
				name: `${config.DEFAULTPREFIX}help | ${await this.guildCount()} servers (${myShardId})`,
			},
		}).catch(e => {
			console.error(e)
		})

		// Creating a new updater
		const updater = new BotListUpdater(myShardId)

		// Interval for updating the amount of servers the bot is used on on bots.ondiscord.xyz every 10 minutes
		setInterval(async () => {
			updater.updateBotsXyz(await this.guildCount())
		}, 600000);

		// Interval for updating the amount of servers the bot is used on on discordbotlist.com every 5 minutes
		// setInterval(async () => {
		// 	updater.updateDiscordBotList(await this.guildCount(), await this.totalMembers(), 0)
		// }, 300000);

	}

	Logger.info(`Ready to serve on ${await this.guildCount()} servers for a total of ${await this.totalMembers()} users.`)
})

// This event will be triggered when the bot joins a guild.
client.on('guildCreate', async guild => {

	// Logging the event
	Logger.info(`Joined server ${guild.name} with ${guild.memberCount} users. Total servers: ${await this.guildCount()}`)

	// saving guild to the database with standard prefix
	await prefixcache.set(guild.id, config.DEFAULTPREFIX)
	// Updating the presence of the bot with the new server amount
	client.user.setPresence({
		activity: {
			name: `${config.DEFAULTPREFIX}help | ${await this.guildCount()} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
	// Sending a "Thank you" message to the owner of the guild
	await guild.owner.send('Thank you for using Wikipedia Bot. :)')


})

// This event will be triggered when the bot is removed from a guild.
client.on('guildDelete', async guild => {

	// Logging the event
	Logger.info(`Left a server. Total servers: ${await this.guildCount()}`)

	// remove guild from database cause we dont need no junk
	await prefixcache.delete(guild.id)
	// Updating the presence of the bot with the new server amount
	client.user.setPresence({
		activity: {
			name: `${config.DEFAULTPREFIX}help | ${await this.guildCount()} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
})

/**
 * Returns the total amount of users who use the bot.
 * */
exports.totalMembers = async () => {
	return client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
		.then(res => {
			return res.reduce((prev, memberCount) => prev + memberCount, 0)
		}).catch(console.error)
}

/**
 * Counting all guilds.
 * */
exports.guildCount = async () => {
	return client.shard.fetchClientValues('guilds.cache.size')
		.then(res => {
			return res.reduce((prev, count) => prev + count, 0)
		}).catch(console.error)
}

// We're logging some commands or messages to make the bot better and to fix more bugs. This will be only the case
// for the beginning of the development. Logging may be turned off for
// the main features and commands. The data will only be used for analysis and to know what we may need to change and to fix.

/* COMMANDS */

client.on('message', async message => {

	if (message.channel.type === 'dm') return

	// eslint-disable-next-line prefer-const
	let PREFIX = await prefixcache.get(message.guild.id) || config.DEFAULTPREFIX
	const VERSION = config.VERSION;

	if (message.mentions.everyone === false && message.mentions.has(client.user)) {
		// Send the message of the help command as a response to the user
		client.commands.get('help').execute(message, null, { PREFIX, VERSION })
	}

	if (message.author.bot) return
	if (!message.content.startsWith(PREFIX)) return undefined

	const args = message.content.split(' ')

	let command = message.content.toLowerCase().split(' ')[0]
	command = command.slice(PREFIX.length)

	// What should the bot do with an unknown command?
	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(client, message, args, { PREFIX, VERSION });
	}
	catch (error) {
		console.error(error);
		await message.reply('there was an error trying to execute that command!');
	}

})

// eslint-disable-next-line no-unused-vars
client.login(config.TOKEN).catch(Logger.error);

process.on('unhandledRejection', PromiseRejection => {
	console.error(PromiseRejection)
})
