const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: donate
 * Description: Sending an embed with links to PayPal Donation and Patreon
 * */
module.exports = {
	name: 'donate',
	alias: ['patreon'],
	description: '',
	execute(client, message, args, config) {
		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		message.channel.send({
			embed: {
				color: 0xffffff,
				title: 'Support the development with a donation',
				description: `If you donated, you will receive a special role on my Discord Server. Type ${config.PREFIX}info to get the invite link.`,
				fields: [
					{
						name: '☕️ Buy Me A Coffee (best option)',
						value: 'You can buy me a coffee [here](https://www.buymeacoffee.com/julianyaman).',
					},
					{
						name: 'PayPal',
						value: 'You can [donate here via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SJHABMNBYCTBC&source=url).',
					},
				],
			},
		})


	},
}
