const Event = require('../../structures/Event')
const { Colors, EmbedBuilder } = require('discord.js')
const serverSchema = require('../../models/serverSchema')
const adminSchema = require('../../models/admin')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Event {
    constructor(client, name='guildBanRemove') {
		super(client, name)
	}

	async run(ban) {
        const { guild } = ban
        const serverSettings = await serverSchema.findOne({ guildId: guild.id })
        const { audits } = serverSettings
        if (!audits) return

        const admin = await adminSchema.findOne({ guildId: guild.id })

        guild.channels.fetch(admin.audits).then((channel) => {
            const embed = new EmbedBuilder()
                .setTitle(`Member Unbanned: ${ban.user.tag} | ${ban.user.id}`)
                .setThumbnail(ban.user.avatarURL())
                .setColor(Colors.Green)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            if (ban.reason) embed.setDescription(ban.reason)
            channel.send({ embeds: [embed] })
        })
	}
}