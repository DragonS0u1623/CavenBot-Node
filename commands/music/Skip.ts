import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='skip') {
        super(client, name, {
            aliases: ['next', 'n'],
            category: 'Music',
            description: 'Skips the currently playing song to the next in queue',
            slash: true,
            data: new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing song to the next in queue').setDMPermission(false)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.skip()
        interaction.editReply(`Skipped to the next song in queue`)
    }

    async run(message: Message, _args: string[]) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.skip()
        message.channel.send(`Skipped to the next song in queue`)
    }
}