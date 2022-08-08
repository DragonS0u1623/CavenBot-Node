const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { RepeatMode } = require('discord-music-player')

module.exports = class extends Command {
    constructor(client, name='repeat') {
        super(client, name, {
            category: 'Music',
            description: 'Sets the repeat for the song or queue',
            expectedArgs: '[NONE|SONG|QUEUE]',
            slash: true,
            data: new SlashCommandBuilder().setName('repeat').setDescription('Sets the repeat for the song or queue')
                .addStringOption(option => option.setName('repeattype')
                    .setDescription('The option for the repeat mode. Either no repeat, song repeat, or queue repeat')
                    .addChoices(
                        {name: 'NONE', value: 'NONE'}, 
                        {name: 'SONG', value: 'SONG'},
                        {name: 'QUEUE', value: 'QUEUE'}
                    ).setRequired(true))
                .setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const repeat = interaction.options.getString('repeattype')
        const { checkPlayerInteraction } = this.client.utils
        const { player } = this.client
        if (!checkPlayerInteraction(player, interaction)) return
        let queue = player.getQueue(interaction.guild.id)

        switch (repeat) {
            case 'NONE':
                queue.setRepeatMode(RepeatMode.DISABLED)
                interaction.editReply('Repeat disabled')
                break
            case 'SONG':
                queue.setRepeatMode(RepeatMode.SONG)
                interaction.editReply('Repeat set to Song')
                break
            case 'QUEUE':
                queue.setRepeatMode(RepeatMode.QUEUE)
                interaction.editReply('Repeat set to Queue')
                break
            default:
                break
        }
    }

    async run(message, args) {
        const { checkPlayerMessage } = this.client.utils
        const { player } = this.client
        if (!checkPlayerMessage(player, message)) return
        let queue = player.getQueue(message.guild.id)

        switch (args[0].toUpperCase()) {
            case 'NONE':
                queue.setRepeatMode(RepeatMode.DISABLED)
                message.channel.send('Repeat disabled')
                break
            case 'SONG':
                queue.setRepeatMode(RepeatMode.SONG)
                message.channel.send('Repeat set to Song')
                break
            case 'QUEUE':
                queue.setRepeatMode(RepeatMode.QUEUE)
                message.channel.send('Repeat set to Queue')
                break
            default:
                message.channel.send('Please use the command with either `NONE`, `SONG`, or `QUEUE`')
                break
        }
    }
}