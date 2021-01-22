module.exports = {
	headers: {
		'User-Agent': 'wikipedia-bot-requests (https://julianyaman.de; julianyaman@posteo.eu) requests.js',
	},
	// All languages supported by the bot.
	// Before adding any additional API URLs, add an alias for this new language in commands/wiki.js.
	apiUrl: {
		// german
		'de': 'https://de.wikipedia.org/w/api.php',
		// english
		'en': 'https://en.wikipedia.org/w/api.php',
		// spanish
		'es': 'https://es.wikipedia.org/w/api.php',
		// french
		'fr': 'https://fr.wikipedia.org/w/api.php',
		// russian
		'ru': 'https://ru.wikipedia.org/w/api.php',
		// slovak
		'sl': 'https://sl.wikipedia.org/w/api.php',
		// turkish
		'tr': 'https://tr.wikipedia.org/w/api.php',
		// yiddish
		'yi': 'https://yi.wikipedia.org/w/api.php',
	},

	// Wikipedia Logo, used in Bot Footers and as author picture in some embeds
	wiki_logo: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
}