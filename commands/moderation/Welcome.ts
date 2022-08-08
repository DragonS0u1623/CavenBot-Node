import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import adminSchema, { admin } from '../../models/admin'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='welcome') {
        super(client, name, {
            category: 'Moderation',
            description: 'Sets the channel to send welcome messages',
            slash: true,
            data: new SlashCommandBuilder().setName('welcome').setDescription('Sets the channel to send welcome messages')
                .addChannelOption(option => option.setName('channel').setDescription('The channel you want to send welcome messages to').setRequired(true))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const { guild } = interaction

        const { id } = interaction.options.getChannel('channel')
        guild.channels.fetch(id).then(async (channel: TextChannel) => {
            await adminSchema.findOneAndUpdate<admin>({ guildId: guild.id }, { welcome: channel.id })
            interaction.editReply(`Welcome messages will be sent to ${channel}`)
        })
    }

    async run(message: Message, args: string[]) {
        const { guild, member } = message

        if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            message.channel.send(`You don't have permission to use this command`)
            return
        }
        
        if (!args || message.mentions.channels.size === 0) {
            message.channel.send(`Please mention a channel for this command`)
            return
        }

        const { id } = message.mentions.channels.first()
        guild.channels.fetch(id).then(async (channel: TextChannel) => {
            await adminSchema.findOneAndUpdate<admin>({ guildId: guild.id }, { welcome: channel.id })
            message.channel.send(`Welcome messages will be sent to ${channel}`)
        })
    }
}