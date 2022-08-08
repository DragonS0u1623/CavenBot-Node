const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord.js')
const adminSchema = require('../../models/admin')

module.exports = class extends Command {
    constructor(client, name='welcome') {
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

    async executeSlash(interaction) {
        interaction.deferReply()
        const { guild } = interaction

        const { id } = interaction.options.getChannel('channel')
        guild.channels.fetch(id).then(async (channel) => {
            await adminSchema.findOneAndUpdate({ guildId: guild.id }, { welcome: channel.id })
            interaction.editReply(`Welcome messages will be sent to ${channel}`)
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
            await adminSchema.findOneAndUpdate({ guildId: guild.id }, { welcome: channel.id })
            message.channel.send(`Welcome messages will be sent to ${channel}`)
        })
    }
}