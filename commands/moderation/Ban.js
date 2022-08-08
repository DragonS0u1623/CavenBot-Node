const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord.js')

module.exports = class extends Command {
    constructor(client, name='ban') {
        super(client, name, {
            name: 'ban',
            category: 'Moderation',
            description: 'Bans the user from the server',
            expectedArgs: '<user> [reason]',
            slash: true,
            data: new SlashCommandBuilder().setName('ban').setDescription('Bans the user from the server')
                .addUserOption(option => option.setName('target').setDescription('The person you want to ban').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason they are being banned').setRequired(false))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const { guild, member } = interaction
        let { id } = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason') || 'No reason given'

        const ban = await guild.members.fetch(id)

        if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            interaction.editReply(`I don't have permission to do that\n\n**Needed Perms**\nBan Members`)
            return
        }

        if (!ban.kickable) {
            interaction.editReply('I can\'t ban that member. They may be have higher roles than me')
            return
        }

        if (member === ban) {
            interaction.editReply('You can\'t ban yourself')
            return
        }

        guild.members.ban(ban, { reason })
        interaction.editReply('Member banned')
    }

    async run(message, args) {
        const { guild, member } = message
        if (!args) {
            message.channel.send('You need to at least provide a user (or their ID) for this command.')
            return
        }

        if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
            message.channel.send('You don\'t have permission to use this command')
            return
        }

        if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            message.channel.send(`I don't have permission to do that\n\n**Needed Perms**\nBan Members`)
            return
        }

        let ban, reason
        
        if (!message.mentions.members) {
            ban = await guild.members.fetch(args.shift())
            reason = args.join(' ')
        } else {
            ban = message.mentions.members.first()
            args.shift()
            reason = args.join(' ')
        }
        
        if (!ban.bannable) {
            message.channel.send('I can\'t ban that member. They may be have higher roles than me')
            return
        }

        if (member.id === ban.id) {
            message.channel.send('You can\'t ban yourself')
            return
        }

        guild.members.ban(ban, { reason })
        message.channel.send('Member banned')
    }
}