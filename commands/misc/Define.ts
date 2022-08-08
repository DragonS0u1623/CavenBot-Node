import { Colors, EmbedBuilder, Message, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../structures/Command'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

let thesaurus = false
let word: string
const apiKeys = [process.env.THESAURUS_KEY, process.env.DICTIONARY_KEY]
const url = `https://dictionaryapi.com/api/v3/references/${thesaurus ? 'thesaurus' : 'collegiate'}/json/${word}?key=${thesaurus ? apiKeys[0] : apiKeys[1]}`

export default class extends Command {
	constructor(client: CavenBot, name='define') {
		super(client, name, {
			category: 'Misc',
			description: 'Defines the given word',
            expectedArgs: '<word>',
            guildOnly: false
		})
	}

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        axios.get(url).then(async (response) => {
            const dictJson = response.data[0]

            let def = ''
            let i = 1
            dictJson.shortdef.forEach((shortdef: string) => {
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

	async run(message: Message, args: string[]) {
        axios.get(url).then(async (response) => {
            const dictJson = response.data[0]

            let def = ''
            let i = 1
            dictJson.shortdef.forEach((shortdef: string) => {
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