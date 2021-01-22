const
	{ MessageEmbed } = require('discord.js'),
	{ wiki_logo } = require('./Constants'),
	messages = require('../localization/messages'),
	botlang = 'en';

module.exports = (client) => {
	client.embed = {
		default: () => {

		},
		shortSummary: (embedobject) => {
			const embed = new MessageEmbed()
				.setTimestamp()
				.setColor('BLUE')
				.setDescription(embedobject.desc)
				.setAuthor('Wikipedia', wiki_logo)
				.setFooter(messages.footertext[botlang], wiki_logo)
			// nullchecks
			embedobject.title ? embed.setTitle(embedobject.title) : 0;
			embedobject.thumb ? embed.setThumbnail(embedobject.thumb) : 0;
			embedobject.url ? embed.setURL(embedobject.url) : 0;
			return embed;
		},
		error: (errormsg) => {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(errormsg)
			return embed;
		},
	}
}