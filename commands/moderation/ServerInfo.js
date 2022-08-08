const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(client, name='info') {
        super(client, name, {
            category: 'Moderation',
            description: 'Gives relevant info about the server',
            slash: true,
            data: new SlashCommandBuilder().setName('info').setDescription('Gives relevant info about the server')
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()
        const { guild } = interaction
        
        let botCount = 0, memberCount = 0
        guild.members.cache.forEach((member) => {
            if (member.user.bot)
				botCount++
			else
				memberCount++
        })

        const owner = await guild.fetchOwner()

        const embed = new EmbedBuilder().setTitle(`${guild.name}: ${guild.id}`).setDescription(`Created at: <t:${guild.createdTimestamp}>`)
            .addFields(
                { name: 'Members', value: `There are ${guild.memberCount} members in the server total\n**Actual Members:** ${memberCount}\n**Bots:** ${botCount}`, inline: false },
                { name: 'Roles', value: `There are ${guild.roles.cache.size} roles in the server`, inline: false },
                { name: 'Boosters', value: `${guild.premiumSubscriptionCount} people have boosted\nThe server is at tier ${guild.premiumTier}`, inline: false }
            )
            .setThumbnail(guild.iconURL())
            .setAuthor({ name: `${owner.user}`, iconURL: owner.user.avatarURL() })
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

        interaction.editReply({ embeds: [embed] })
    }

    async run(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            message.channel.send('You don\'t have permission to use this command')
            return
        }
        const { guild } = message

        let botCount = 0, memberCount = 0
        guild.members.cache.forEach((member) => {
            if (member.user.bot)
				botCount++
			else
				memberCount++
        })

        const owner = await guild.fetchOwner()

        const embed = new EmbedBuilder().setTitle(`${guild.name}: ${guild.id}`).setDescription(`Created at: <t:${guild.createdTimestamp}>`)
            .addFields(
                { name: 'Members', value: `There are ${guild.memberCount} members in the server total\n**Actual Members:** ${memberCount}\n**Bots:** ${botCount}`, inline: false },
                { name: 'Roles', value: `There are ${guild.roles.cache.size} roles in the server`, inline: false },
                { name: 'Boosters', value: `${guild.premiumSubscriptionCount} people have boosted\nThe server is at tier ${guild.premiumTier}`, inline: false }
            )
            .setThumbnail(guild.iconURL())
            .setAuthor({ name: `${owner.user}`, iconURL: owner.user.avatarURL() })
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

        message.channel.send({ embeds: [embed] })
    }
}