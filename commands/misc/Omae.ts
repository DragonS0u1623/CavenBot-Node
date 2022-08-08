import { ChatInputCommandInteraction, Colors, EmbedBuilder, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'

const gif1 = 'https://cdn.discordapp.com/attachments/640674672618373132/647205970442846220/20191121_172359.jpg'
const gif2 = 'https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif'

export default class extends Command {
	constructor(client: CavenBot, name='omae') {
		super(client, name, {
			category: 'Misc',
			description: 'Gives an anime joke',
            guildOnly: false
		})
	}

	async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        let embed = new EmbedBuilder()
            .setTitle('Omae wa mou shindeiru')
            .setURL(gif1)
            .setImage(gif1)
            .setColor(Colors.Orange)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        interaction.editReply({ embeds: [embed] })
        
        embed.setTitle('NANI!!!!!!!').setURL(gif2).setImage(gif2).setColor(Colors.Red)

        interaction.followUp({ embeds: [embed] })
    }

	async run(message: Message) {
        let embed = new EmbedBuilder()
            .setTitle('Omae wa mou shindeiru')
            .setURL(gif1)
            .setImage(gif1)
            .setColor(Colors.Orange)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        message.channel.send({ embeds: [embed] })
    
        embed.setTitle('NANI!!!!!!!').setURL(gif2).setImage(gif2).setColor(Colors.Red)
		message.channel.send({ embeds: [embed] })
	}
}