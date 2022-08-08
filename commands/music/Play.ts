import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='play') {
        super(client, name, {
            aliases: ['p'],
            category: 'Music',
            description: 'Plays the given song or adds it to the queue if the player is already playing a song',
            expectedArgs: '[url]',
            slash: true,
            data: new SlashCommandBuilder().setName('play')
                .setDescription('Plays the given song or adds it to the queue if the player is already playing a song')
                .addStringOption(option => option.setName('url').setDescription('The url or search term to play').setRequired(true))
                .setDMPermission(false)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const url = interaction.options.getString('url')
        const { player } = this.client
        let queue = player.hasQueue(interaction.guild.id) ? player.getQueue(interaction.guild.id) : player.createQueue(interaction.guild.id, {
            data: {
                channel: interaction.channel,
                vc: null,
                npMessage: null
            }
        })

        const { guild } = interaction
        const member = guild.members.resolve(interaction.user)

        if (!member.voice) {
            interaction.editReply(`You need to be in a voice channel to use this command`)
            return
        }
        const { channel } = member.voice

        await queue.join(channel)
        queue.setData({
            channel: interaction.channel,
            vc: channel,
            npMessage: null
        })

        if (url.includes('youtube.com/playlist') || url.includes('open.spotify.com/playlist')) {
            await queue.playlist(url, { requestedBy: interaction.user }).catch((err: any) => {
                if (!queue) queue.stop()
            })
        } else {
            await queue.play(url, { requestedBy: interaction.user }).catch((err: any) => {
                if (!queue) queue.stop()
            })
        }
    }

    async run(message: Message, args: string[]) {
        const { player } = this.client
        let queue = player.hasQueue(message.guild.id) ? player.getQueue(message.guild.id) : player.createQueue(message.guild.id, {
            data: {
                channel: message.channel,
                vc: null,
                npMessage: null
            }
        })
        const { member } = message
        if (!member.voice) {
            message.channel.send(`You need to be in a voice channel to use this command`)
            return
        }

        const { channel } = member.voice

        await queue.join(channel)
        queue.setData({
            channel: message.channel,
            vc: channel,
            npMessage: null
        })
        queue.setVolume(50)

        const url = args.join()

        if (url.includes('youtube.com/playlist') || url.includes('open.spotify.com/playlist')) {
            await queue.playlist(url, { requestedBy: message.author }).catch((error: any) => {
                if (!queue) queue.stop()
            })
        } else {
            await queue.play(url, { requestedBy: message.author }).catch((error: any) => {
                if (!queue) queue.stop()
            })
        }
    }
}