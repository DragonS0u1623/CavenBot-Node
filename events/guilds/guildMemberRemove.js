const Event = require('../../structures/Event')
const { Colors, EmbedBuilder } = require('discord.js')
const serverSchema = require('../../models/serverSchema')
const adminSchema = require('../../models/admin')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Event {
    constructor(client, name='guildMemberRemove') {
		super(client, name)
	}

	async run(member) {
        const { guild } = member
        const serverSettings = await serverSchema.findOne({ guildId: guild.id })
        const { audits } = serverSettings
        if (!audits || member.user.bot) return

        const admin = await adminSchema.findOne({ guildId: guild.id })

        guild.channels.fetch(admin.audits).then((channel) => {
            const embed = new EmbedBuilder()
                .setTitle(`Member Left: ${member}`)
                .setDescription('Left the server')
                .setThumbnail(member.avatarURL())
                .setColor(Colors.Purple)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            let rolesString = ''
            member.roles.cache.forEach(role => rolesString += `${role} `)
            embed.addFields({ name: 'Roles At Time:', value: rolesString, inline: false })

            channel.send({ embeds: [embed] })
        })
	}
}