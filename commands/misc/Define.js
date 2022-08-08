const { Colors, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

let thesaurus = false
let word
const apiKeys = [process.env.THESAURUS_KEY, process.env.DICTIONARY_KEY]
const url = `https://dictionaryapi.com/api/v3/references/${thesaurus ? 'thesaurus' : 'collegiate'}/json/${word}?key=${thesaurus ? apiKeys[0] : apiKeys[1]}`

module.exports = class extends Command {
	constructor(client, name='define') {
		super(client, name, {
			category: 'Misc',
			description: 'Defines the given word',
            expectedArgs: '<word>',
            guildOnly: false,
            slash: true,
            data: new SlashCommandBuilder().setName('define').setDescription('Defines the given word')
                .addStringOption(option => option.setName('word').setDescription('The word that you want to define').setRequired(true))
		})
	}

    async executeSlash(interaction) {
        interaction.deferReply()

        word = interaction.options.getString('word')

        axios.get(url).then(async (response) => {
            const dictJson = response.data[0]

            let def = ''
            let i = 1
            dictJson.shortdef.forEach((shortdef) => {
                def += `**${i})** ${shortdef}\n`
                i++
            })

            thesaurus = false
            const thesaurusJson = (await axios.get(url)).data[0].meta

            let synonyms = ''
            for(let i = 0; i < 5; i++)
                synonyms += `**${i+1})** ${thesaurusJson.syns[i]}\n`

            const embed = new EmbedBuilder()
                .setTitle(`Definition of ${word}`)
                .setDescription(def)
                .addFields({ name: 'Synonyms', value: synonyms, inline: false })
                .setColor(Colors.Blue)
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An unexpected error has occurred. Please try again.'))
    }

	async run(message, args) {
        if (!args) {
            message.channel.send('You need to provide a word to define')
            return
        }

        word = args[0]

        axios.get(url).then(async (response) => {
            const dictJson = response.data[0]

            let def = ''
            let i = 1
            dictJson.shortdef.forEach((shortdef) => {
                def += `**${i})** ${shortdef}\n`
                i++
            })

            thesaurus = false
            const thesaurusJson = (await axios.get(url)).data[0].meta

            let synonyms = ''
            for(let i = 0; i < 5; i++)
                synonyms += `**${i+1})** ${thesaurusJson.syns[i]}\n`

            const embed = new EmbedBuilder()
                .setTitle(`Definition of ${word}`)
                .setDescription(def)
                .addFields({ name: 'Synonyms', value: synonyms, inline: false })
                .setColor(Colors.Blue)
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An unexpected error has occurred. Please try again.'))
	}
}