const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='shuffle') {
        super(client, name, {
            aliases: ['shuf', 'mix'],
            category: 'Music',
            description: 'Shuffles the entire queue',
            slash: true,
            data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffles the entire queue').setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        queue.shuffle()
        interaction.editReply(`Shuffled the queue`)
    }

    async run(message) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        queue.shuffle()
        message.channel.send(`Shuffled the queue`)
    }
}