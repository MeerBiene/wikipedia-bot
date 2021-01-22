const 
	Logger = new (require('./../modules/util')).Logger,
	messages = require('../localization/messages'),
	botlang = "en";

/**
 * Command: wiki-number
 * Description: It helps you to get specific information about a specific topic (e.g. dates, numbers, etc.)
 * */
module.exports = {
	name: 'wiki-info',
	description: 'It helps you to get specific information about a specific topic (e.g. dates, numbers, etc.)',
	async execute(client, message, args, config) {

		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		if (!args[1]) return (client.badArgumentReaction(message), message.channel.send(client.embed.error(messages.nokeyworderror[botlang])))
		
		const info = await client.wiki.getShortInformation(args[1])

		if (info.error) return await client.badArgumentReaction(message)
		
		await message.channel.send(client.embed.shortSummary({
			desc: `**Name:** ${info.info.general.name} \n**Genus:** ${info.info.general.genus} \n**Species:** ${info.info.general.species}`,
			thumb: await info.page.mainImage(),
			title: info.page.title,
			url: info.page.fullurl
		}))


		// // USAGE: !wiki-info [TYPE OF INFORMATION] [ARGUMENT]
		// if (!args[1]) {
		// 	message.reply('you forgot to search for something. -> ``' + config.PREFIX + 'wiki-info [argument] | Example ' + config.PREFIX + 'wiki-info "Rocket League"``')
		// }
		// else {
		//
		// 	let informationArguments = message.content.replace(`${config.PREFIX}${this.name} `, '')
		// 	// https://regex101.com/r/qa3KxQ/1/ and https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
		// 	informationArguments = informationArguments.match(/[^\s"']+|"([^"]*)"+|'([^']*)'/gmi)
		//
		// 	const searchValue = informationArguments[0].replace(/["']/g, '')
		// 	const informationType = informationArguments[1]
		//
		// 	// message, search value, type of information (optional)
		// 	// requests.getWikipediaShortInformation(message, searchValue)
		// }

	},
}
