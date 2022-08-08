const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='leave') {
        super(client, name, {
            aliases: ['l'],
            category: 'Music',
            description: 'Makes the bot leave your current voice channel',
            slash: true,
            data: new SlashCommandBuilder().setName('leave').setDescription('Makes the bot leave your current voice channel')
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.stop()
    }

    async run(message) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.stop()
    }
}