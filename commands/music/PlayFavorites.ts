import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='playFavorites') {
        super(client, name, {
            aliases: ['fav', 'favorites'],
            category: 'Music',
            description: 'Makes the bot play your Favorites playlist if you have one.',
            slash: true,
            data: new SlashCommandBuilder().setName('join').setDescription('Makes the bot join your current voice channel')
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        const { player } = this.client
        const { guild } = interaction
        const member = guild.members.resolve(interaction.user)

        if (!member.voice) {
            interaction.reply(`You must be in a voice channel to use this command`)
            return
        }
        const { channel } = member.voice
        
        
    }

    async run(message: Message, _args: string[]) {
        const { player } = this.client
        const { member, guild } = message
        if (!member.voice) {
            message.channel.send(`You must be in a voice channel to use this command`)
            return
        }
        const { channel } = member.voice

        
    }
}