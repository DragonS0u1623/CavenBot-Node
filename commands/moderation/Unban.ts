import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, ChatInputCommandInteraction, PermissionFlagsBits, User, GuildBan } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='unban') {
        super(client, name, {
            category: 'Moderation',
            description: 'Unbans the user from the server. Uses the user ID',
            expectedArgs: '<userID> [reason]',
            slash: true,
            data: new SlashCommandBuilder().setName('unban').setDescription('Unbans the user from the server. Uses the user ID')
                .addUserOption(option => option.setName('target').setDescription('The user you want to unban').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason for the unban').setRequired(false))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const { guild } = interaction
        if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            interaction.editReply(`I don't have permission to do that\n\n**Needed Perms**\nBan Members`)
            return
        }

        let target: User = interaction.options.getUser('target', true), reason: string = interaction.options.getString('reason')
        guild.bans.fetch(target).then((ban: GuildBan) => {
            guild.bans.remove(target, reason).then(() => interaction.editReply(`Member unbanned`))
        }).catch(() => interaction.editReply(`Please make sure that you gave the correct User ID`))
    }

    async run(message: Message, args: string[]) {
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

        let target: User, reason: string
        guild.bans.fetch(args.shift()).then((ban: GuildBan) => {
            target = ban.user
            reason = args.join(' ')
            guild.bans.remove(target, reason).then(() => message.channel.send(`Member unbanned`))
        }).catch(() => message.channel.send(`Please make sure that you gave the correct User ID`))
    }
}