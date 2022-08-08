const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='resume') {
        super(client, name, {
            aliases: ['r'],
            category: 'Music',
            description: 'Makes the bot resume playing the music',
            slash: true,
            data: new SlashCommandBuilder().setName('resume').setDescription('Makes the bot resume playing the music').setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.setPaused(false)
        interaction.editReply(`Resumed playing`)
    }

    async run(message) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.setPaused(false)
        message.channel.send(`Resumed playing`)
    }
}