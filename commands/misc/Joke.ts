import axios from 'axios'
import { Message, ChatInputCommandInteraction } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'

const url = 'https://sv443.net/jokeapi/v2/joke/Any'

export default class extends Command {
	constructor(client: CavenBot, name='joke') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends a random joke to the chat',
            guildOnly: false
		})
	}

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        axios.get(url).then(response => {
            const json = response.data

            let joke = ''
            if (json.type === 'single')
                joke = json.joke
            else if (json.type === 'twopart')
                joke = `${json.setup}\n${json.delivery}`
            interaction.editReply(joke)
        }).catch(error => interaction.editReply('An unexpected error has occurred. Please try again.'))
    }

	async run(message: Message) {
        axios.get(url).then(response => {
            const json = response.data
            
            let joke = ''
            if (json.type === 'single')
                joke = json.joke
            else if (json.type === 'twopart')
                joke = `${json.setup}\n${json.delivery}`
            message.channel.send(joke)
        }).catch(error => message.channel.send('An unexpected error has occurred. Please try again.'))
	}
}