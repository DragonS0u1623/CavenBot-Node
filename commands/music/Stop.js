const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='stop') {
        super(client, name, {
            aliases: ['s'],
            category: 'Music',
            description: 'Stops the music and clears the queue',
            slash: true,
            data: new SlashCommandBuilder().setName('stop').setDescription('Stops the music and clears the queue').setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.stop()
        interaction.editReply(`Song stopped and queue cleared`)
    }

    async run(message) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.stop()
        message.channel.send(`Song stopped and queue cleared`)
    }
}