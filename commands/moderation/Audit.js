const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord.js')
const adminSchema = require('../../models/admin')

module.exports = class extends Command {
    constructor(client, name='audit') {
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

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { guild } = interaction
        const { id } = interaction.options.getChannel('channel', true)
        guild.channels.fetch(id).then(async (channel) => {
            await adminSchema.findOneAndUpdate({ guildId: guild.id }, { audits: channel.id })
            interaction.editReply(`Audit logs will be sent to ${channel}`)
        })
    }

    async run(message, args) {
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
        guild.channels.fetch(id).then(async (channel) => {
            await adminSchema.findOneAndUpdate({ guildId: guild.id }, { audits: channel.id })
            message.channel.send(`Audit logs will be sent to ${channel}`)
        })
    }
}