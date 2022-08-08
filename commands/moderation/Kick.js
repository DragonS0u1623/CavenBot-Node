const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits, Colors, EmbedBuilder } = require('discord.js')
const adminSchema = require('../../models/admin')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(client, name='kick') {
        super(client, name, {
            category: 'Moderation',
            description: 'Kicks the user from the server',
            expectedArgs: '<user> [reason]',
            slash: true,
            data: new SlashCommandBuilder().setName('kick').setDescription('Kicks the user from the server')
                .addUserOption(option => option.setName('target').setDescription('The person you want to kick').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason they are being kicked').setRequired(false))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const { guild, member } = interaction
        let { id } = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason') || 'No reason given'

        const kick = await guild.members.fetch(id)

        if (!guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            interaction.editReply(`I don't have permission to do that\n\n**Needed Perms**\nKick Members`)
            return
        }

        if (!kick.kickable) {
            interaction.editReply('I can\'t kick that member. They may be have higher roles than me')
            return
        }

        if (member === kick) {
            interaction.editReply('You can\'t kick yourself')
            return
        }

        guild.members.kick(kick, reason).then(async (__) => {
            interaction.editReply('Member kicked')

            const admin = await adminSchema.findOne<admin>({ guildId: guild.id })
            guild.channels.fetch(admin.audits).then(async (channel) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Member Kicked: ${kick}`)
                    .setThumbnail(kick.avatarURL())
                    .setColor(Colors.Purple)
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
    
                if (reason) embed.setDescription(reason)
                channel.send({ embeds: [embed] })
            })
        })
    }

    async run(message, args) {
        const { guild, member } = message
        if (!args) {
            message.channel.send('You need to at least provide a user (or their ID) for this command.')
            return
        }

        if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
            message.channel.send('You don\'t have permission to use this command')
            return
        }

        if (!guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            message.channel.send(`I don't have permission to do that\n\n**Needed Perms**\nKick Members`)
            return
        }

        let kick, reason
        if (!message.mentions.members) {
            kick = await guild.members.fetch(args.shift())
            reason = args.join(' ')
        } else {
            kick = message.mentions.members.first()
            args.shift()
            reason = args.join(' ')
        }
        
        if (!kick.kickable) {
            message.channel.send('I can\'t kick that member. They may be have higher roles than me')
            return
        }

        if (member.id === kick.id) {
            message.channel.send('You can\'t kick yourself')
            return
        }

        guild.members.kick(kick, reason).then(async (__) => {
            message.channel.send('Member kicked')

            const admin = await adminSchema.findOne({ guildId: guild.id })
            guild.channels.fetch(admin.audits).then(async (channel) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Member Kicked: ${kick}`)
                    .setThumbnail(kick.avatarURL())
                    .setColor(Colors.Purple)
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
    
                if (reason) embed.setDescription(reason)
                channel.send({ embeds: [embed] })
            })
        })
    }
}