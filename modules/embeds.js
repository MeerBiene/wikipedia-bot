const 
    { MessageEmbed } = require('discord.js'),
    { wiki_logo } = require('./Constants'),
    messages = require('../localization/messages'),
    botlang = "en";

module.exports = {
    ... client,
    embed: {
        default: async () => {

        },
        shortSummary: async (embedobject) => {
            const embed = new MessageEmbed()
                .setTimestamp()
                .setColor("3447003")
                .setDescription(embedobject.desc)
                .setAuthor("Wikipedia", wiki_logo)
                .setFooter(messages.footertext[botlang], wiki_logo)
                // nullchecks
                embedobject.title ? embed.setTitle(embedobject.title) : 0;
                embedobject.thumb ? embed.setThumbnail(embedobject.thumb) : 0;
                embedobject.url ? embed.setUrl(embedobject.url): 0;
            return embed;
        },
        error: async (errormsg) => {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(errormsg)
            return embed;
        }
    }
}