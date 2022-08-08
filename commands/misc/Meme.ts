import { Colors, EmbedBuilder, Message, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../structures/Command'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

const url = 'https://meme-api.herokuapp.com/gimme'

export default class extends Command {
	constructor(client: CavenBot, name='meme') {
		super(client, name, {
			name: 'meme',
			category: 'Misc',
			description: 'Sends a random meme',
            guildOnly: false
		})
	}

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        axios.get(url).then(response => {
            const json = response.data

            const embed = new EmbedBuilder()
                .setTitle(json.title)
                .setDescription(`Meme for ${interaction.user} from subreddit [r/${json.subreddit}](https://www.reddit.com/r/${json.subreddit})`)
                .setURL(json.postLink)
                .setImage(json.url)
                .setColor(Colors.Yellow)
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An unexpected error has occurred. Please try again.'))
    }

	async run(message: Message) {
        axios.get(url).then(response => {
            const json = response.data

            const embed = new EmbedBuilder()
                .setTitle(json.title)
                .setDescription(`Meme for ${message.author} from subreddit [r/${json.subreddit}](https://www.reddit.com/r/${json.subreddit})`)
                .setURL(json.postLink)
                .setImage(json.url)
                .setColor(Colors.Yellow)
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An unexpected error has occurred. Please try again.'))
	}
}