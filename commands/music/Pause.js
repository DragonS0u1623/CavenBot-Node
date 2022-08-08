const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='pause') {
        super(client, name, {
            description: 'Pauses the currently playing song',
            category: 'Music',
            slash: true,
            data: new SlashCommandBuilder().setName('pause').setDescription('Pauses the currently playing song').setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.setPaused(true)
        interaction.editReply(`The current song has been paused`)
    }

    async run(message) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.setPaused(true)
        message.channel.send(`The current song has been paused`)
    }
}