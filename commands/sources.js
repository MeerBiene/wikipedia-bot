// TODO: wiki-sources, sources or references as the command name?

const
	Logger = new (require('./../modules/util')).Logger,
	paginationEmbed = require('discord.js-pagination'),
	messages = require('../localization/messages'),
	{ MessageEmbed } = require('discord.js-light'),
	c = require('centra'),
	botlang = "en";



/**
 * Command: sources
 * Description: Sends you a full list of all sources of a Wikipedia article
 * */
module.exports = {
	name: 'sources',
	alias: ['references'],
	description: 'Sends you a full list of all sources of a Wikipedia article',
	async execute(client, message, args, config) {

		const command = args[0].slice(config.PREFIX.length)

		// Check in what type of channel the command was executed
		if (message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else {
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		if (!args[1]) {

			// Send an embed which explains this command
			message.channel.send({
				embed: {
					color: 3447003,
					author: {
						icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
						name: 'Wikipedia',
					},
					title: '\'References\' Command 101',
					timestamp: new Date(),
					description: 'This helps to understand how this command works.',
					fields: [
						{
							name: 'Generally the command works like this:',
							value: '`' + config.PREFIX + command + ' "<search argument>" <range>` \n\n' +
								'**Example:** ' + '`' + config.PREFIX + command + ' "Elon Musk" 1-5`\n ' +
								'You give a search term and a specific range from which \nto which reference you want to get the link of.',
						},
						{
							name: '\nYou can also get some information about the references\nof a Wikipedia article with setting range to *info*',
							value: '**Example:** ' + '`' + config.PREFIX + command + ' "Elon Musk" info`\n ',
						},
						{
							name: '\nIf you leave the range empty or write *all* as the range, \nyou\'ll get the link to the Wikipedia article references',
							value: '**Example:** ' + '`' + config.PREFIX + command + ' "Elon Musk" all`\n ',
						},
					],
				},
			})

		}
		else {
			// Get the command arguments
			let commandArgs = message.content.replace(`${config.PREFIX}${command} `, '')
			// https://regex101.com/r/qa3KxQ/1/ and https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
			commandArgs = commandArgs.match(/[^\s"']+|"([^"]*)"+|'([^']*)'/gmi)

			// Search value -> "search"
			const searchValue = commandArgs[0].replace(/["']/g, '')
			// Range -> e.g.: 1-30 or 30-40 or all
			const range = commandArgs[1]
			// Do the request!
			//await client.getWikipediaReferences(message, searchValue, range)

			try {

				message.channel.startTyping().catch(e => Logger.error(e))
				const refs = await client.wiki.getReferences(searchValue)
				message.channel.stopTyping();


				const linkarrays = []
				const embeds = []
				let output = '';

				// group together the links by groups of 10
				while (refs.results[3].length > 10) {
					linkarrays.push(refs.results[3].splice(0, 10))
				}

				for (let i = 0; i < linkarrays.length; i++) {
					for (let j = 0; j < linkarrays[i].length; j++) {
						output += `**[${j + 1}]**   ${linkarrays[i][j]} \n`
					}



					let em = client.embed.shortSummary({
						title: refs.results[0],
						url: refs.results[1],
						desc: output
					})


					embeds.push(em)
					output = '';

				}

				paginationEmbed(message, embeds, ['⏪', '⏩'], 120000)


			} catch (e) {
				client.badArgumentReaction(message)
				Logger.error(e)
				message.channel.stopTyping();
				message.channel.send(client.embed.error(messages.noreferencesfound[botlang]))
			}

		}

	},
}
