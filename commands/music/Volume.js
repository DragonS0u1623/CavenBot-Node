const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='volume') {
        super(client, name, {
            aliases: ['v'],
            category: 'Music',
            description: 'Sets the volume for the music playing',
            slash: true,
            data: new SlashCommandBuilder().setName('volume')
                .setDescription('Sets the volume for the music playing')
                .addIntegerOption(option => option.setName('volume').setDescription('The value to change the volume to').setRequired(true))
                .setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        let volume = interaction.options.getInteger('volume')
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        if (volume > 50) volume = 50
        queue.setVolume(volume)
        interaction.editReply(`Volume set to ${volume*2}%`)
        
    }

    async run(message, args) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)
        
        let volume = parseInt(args[0])
        if (volume > 50) volume = 50
        queue.setVolume(volume)
        message.channel.send(`Volume set to ${volume*2}%`)
    }
}