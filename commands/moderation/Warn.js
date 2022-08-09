const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const adminSchema = require('../../models/admin')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(client, name='warn') {
        super(client, name, {
            category: 'Moderation',
            description: 'Warns the user with the given reason',
            expectedArgs: '<user> <reason>',
            slash: true,
            data: new SlashCommandBuilder().setName('warn').setDescription('Warns the user with the given reason')
                .addUserOption(option => option.setName('target').setDescription('The person you want to warn').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason you are warning this user').setRequired(true))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers | PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { guild } = interaction

        const admin = await adminSchema.findOne({ guildId: guild.id })
        guild.channels.fetch(admin.audits).then(async (channel) => {
            let target, reason = interaction.options.getString('reason')
            const { id } = interaction.options.getUser('target')

            target = await guild.members.fetch(id)

            const embed = new EmbedBuilder()
                .setTitle(`${target.tag} Warned`)
                .setDescription(reason)
                .setThumbnail(target.avatarURL())
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            target.createDM().then(dm => dm.send(`You have been warned in ${guild}\nReason: ${reason}`))
            channel.send({ embeds: [embed] })
            interaction.editReply('Member warned')
        })
    }

    async run(message, args) {
        const { guild, member } = message

        if (!args || args.length < 2) {
            message.channel.send(`You need to at least provide a user/ID and a single word reason for this command`)
            return
        }

        if (!member.permissions.has(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers | PermissionFlagsBits.ModerateMembers)) {
            message.channel.send(`You don't have permission to use this command`)
            return
        }

        const admin = await adminSchema.findOne({ guildId: guild.id })
        guild.channels.fetch(admin.audits).then(async (channel) => {
            let user, reason
            if (message.mentions.members.size === 0) {
                user = await guild.members.fetch(args.shift())
                reason = args.join(' ')
            } else {
                user = message.mentions.members.first()
                args.shift()
                reason = args.join(' ')
            }

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag} Warned`)
                .setDescription(reason)
                .setThumbnail(user.avatarURL())
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            user.createDM().then(dm => dm.send(`You have been warned in ${guild}\nReason: ${reason}`))
            channel.send({ embeds: [embed] })
            message.channel.send('Member warned')
        })
    }
}