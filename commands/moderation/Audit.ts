import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import adminSchema, { admin } from '../../models/admin'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='audit') {
        super(client, name, {
            category: 'Moderation',
            description: 'Sets the channel to send audit log data',
            expectedArgs: '<channel>',
            slash: true,
            data: new SlashCommandBuilder().setName('audit').setDescription('Sets the channel to send audit log data')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to send audit messages to').setRequired(true))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const { guild } = interaction
        const { id } = interaction.options.getChannel('channel', true)
        guild.channels.fetch(id).then(async (channel: TextChannel) => {
            await adminSchema.findOneAndUpdate<admin>({ guildId: guild.id }, { audits: channel.id })
            interaction.editReply(`Audit logs will be sent to ${channel}`)
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
            await adminSchema.findOneAndUpdate<admin>({ guildId: guild.id }, { audits: channel.id })
            message.channel.send(`Audit logs will be sent to ${channel}`)
        })
    }
}