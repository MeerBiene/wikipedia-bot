module.exports.wiki = {
    name: "wiki",
    description: "Returns the summary of a wikipedia article",
    options: [
        {
            name: "Search-Term",
            description: "The search term you want to search for",
            required: true,
            type: 3
        },
        {
            name: "Language",
            description: "The language in which you want to search",
            type: 3,
            choices: [
                {
                    name: "English",
                    value: "en"
                },
                {
                    name: "German",
                    value: "de"
                },
                {
                    name: "Spanish",
                    value: "es"
                },
                {
                    name: "French",
                    value: "fr"
                },
                {
                    name: "Russian",
                    value: "ru"
                },
                {
                    name: "Slovak",
                    value: "sl"
                },
                {
                    name: "Turkish",
                    value: "tr"
                },
                {
                    name: "Yiddish",
                    value: "yi"
                }
            ]
        }
    ]
}

module.exports.config = {
    // the id that discord returned us, we will need this
    // for the interaction handler
    id: "802496465313857557",
    name: "wiki"
}


module.exports.execute = async () => {

}
