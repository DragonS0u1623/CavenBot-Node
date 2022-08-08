const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='join') {
        super(client, name, {
            aliases: ['j'],
            category: 'Music',
            description: 'Makes the bot join your current voice channel',
            slash: true,
            data: new SlashCommandBuilder().setName('join').setDescription('Makes the bot join your current voice channel')
        })
    }

    async executeSlash(interaction) {
        const { player } = this.client
        const { guild } = interaction
        const member = guild.members.resolve(interaction.user)
        if (!member.voice) {
            interaction.reply(`You must be in a voice channel to use this command`)
            return
        }
        const { channel } = member.voice
        
        let queue = player.createQueue(guild.id, {
            data: {
                channel: interaction.channel,
                vc: channel,
                npMessage: null
            }
        })
        queue.join(channel)
    }

    async run(message) {
        const { player } = this.client
        const { member, guild } = message
        if (!member.voice) {
            message.channel.send(`You must be in a voice channel to use this command`)
            return
        }
        const { channel } = member.voice

        let queue = player.createQueue(guild.id, {
            data: {
                channel: message.channel,
                vc: channel,
                npMessage: null
            }
        })
        queue.join(channel)
    }
}