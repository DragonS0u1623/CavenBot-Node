const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord.js')

module.exports = class extends Command {
    constructor(client, name='clear') {
        super(client, name, {
            category: 'Moderation',
            description: 'Clears the specified amount of messages from the channel. Default is 5',
            expectedArgs: '[number]',
            slash: true,
            data: new SlashCommandBuilder().setName('clear').setDescription('Clears the specified amount of messages from the channel. Default is 5')
                .addIntegerOption(option => option.setName('amount').setDescription('The amount to clear').setRequired(false))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        })
    }

    async executeSlash(interaction) {
        const { guild } = interaction
        
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            interaction.editReply(`I don't have permission to do that\n\n**Needed Perms**\nManage Messages`)
            return
        }

        let limit = interaction.options.getInteger('amount') || 5

        const filter = (m) => !m.pinned
        interaction.channel.awaitMessages({ filter, max: limit }).then(messages => messages.forEach(message => message.delete()))
    }

    async run(message, args) {
        const { guild, member } = message
        
        if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            message.channel.send(`You don't have permission to use this command`)
            return
        }

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            message.channel.send(`I don't have permission to do that\n\n**Needed Perms**\nManage Messages`)
            return
        }

        let limit = 5
        if (args) limit = parseInt(args[0])

        const filter = (m) => !m.pinned
        message.channel.awaitMessages({ filter, max: limit }).then(messages => messages.forEach(message => message.delete()))
    }
}