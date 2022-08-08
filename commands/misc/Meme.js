const { Colors, EmbedBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const url = 'https://meme-api.herokuapp.com/gimme'

module.exports = class extends Command {
	constructor(client, name='meme') {
		super(client, name, {
			name: 'meme',
			category: 'Misc',
			description: 'Sends a random meme',
            guildOnly: false
		})
	}

    async executeSlash(interaction) {
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

	async run(message) {
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