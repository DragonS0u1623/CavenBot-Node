const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='skip') {
        super(client, name, {
            aliases: ['next', 'n'],
            category: 'Music',
            description: 'Skips the currently playing song to the next in queue',
            slash: true,
            data: new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing song to the next in queue').setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.skip()
        interaction.editReply(`Skipped to the next song in queue`)
    }

    async run(message) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.skip()
        message.channel.send(`Skipped to the next song in queue`)
    }
}