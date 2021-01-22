/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests

const Logger = new (require('./util')).Logger()
const wiki = require('wikijs').default
let { apiUrl, headers, wiki_logo } = require('./Constants')

module.exports = async (client) => {
    client.wiki = {
        /**
         * Function that returns a returnobject with an error or the requested information
         * @function getSummary
         * @param {String} argument - Argument sent by the user (!wiki [argument])
         * @param {String} lang - Language in which the result should be sent.
         * 
         * @returns {Object} returnobject: 
         * {
         *      error: Boolean,
         *      results: Array[
         *          title,
         *          fullurl,
         *          mainImage,
         *          summary
         *      ]
         * }
         * 
         */
        getSummary: async (argument, lang) => {
            const returnobject = { error: false, results: [] }
            apiUrl = apiUrl[lang]

            try {

                const search = await wiki({ apiUrl, headers }).search(argument)
                const wikiPage = await wiki({ apiUrl, headers }).page(search.results[0])

                returnobject.results = await Promise.all([
                    wikiPage.raw.title,
                    wikiPage.raw.fullurl,
                    wikiPage.mainImage(),
                    wikiPage.summary()
                ])

            } catch (e) {
                returnobject.error = true;
                Logger.error(e)
            }

            return returnobject;
        },
        // method to get the full article
        getFullArticle: async () => {

        },
        getReferences: async (argument) => {
            const returnobject = { error: false, results: [] }

            try {

                const sourceSearch = await wiki({ headers }).search(argument)
                const wikiPageSources = await wiki({ headers }).page(sourceSearch.results[0])

                const sourceResults = await Promise.all([
                    wikiPageSources.raw.title,
                    wikiPageSources.raw.fullurl,
                    wikiPageSources.mainImage(),
                    wikiPageSources.references(),
                ])

                returnobject.results = sourceResults;

            } catch (e) {
                returnobject.error = true;
                Logger.error(e)
            }

            return returnobject;

        },
        getShortInformation: async (argument) => {
            const returnobject = { error: false }

            try {

                const data = await wiki().search(argument)
                const page = await wiki().page(data.results[0])
                const info = await page.fullInfo()

                returnobject.page = page
                returnobject.info = info

            } catch (e) {
                returnobject.error = true;
                Logger.error(e)
                Logger.error(`[1] An error occurred while requesting the data from Wikipedia - Searched for: '${argument}' - no result`)
            }

            return returnobject;
        }

    },
        client.badArgumentReaction = async (msg) => {
            await msg.react('👎').catch(err => Logger.error(err))
        };
};