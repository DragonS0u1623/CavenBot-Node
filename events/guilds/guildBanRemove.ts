import Event from '../../structures/Event'
import { Colors, EmbedBuilder, GuildBan, TextChannel } from 'discord.js'
import serverSchema, { serverSettings } from '../../models/serverSchema'
import adminSchema, { admin } from '../../models/admin'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

export default class extends Event {
    constructor(client: CavenBot, name='guildBanRemove') {
		super(client, name)
	}

	async run(ban: GuildBan) {
        const { guild } = ban
        const serverSettings = await serverSchema.findOne<serverSettings>({ guildId: guild.id })
        const { audits } = serverSettings
        if (!audits) return

        const admin = await adminSchema.findOne<admin>({ guildId: guild.id })

        guild.channels.fetch(admin.audits).then((channel: TextChannel) => {
            const embed = new EmbedBuilder()
                .setTitle(`Member Unbanned: ${ban.user} | ${ban.user.id}`)
                .setThumbnail(ban.user.avatarURL())
                .setColor(Colors.Green)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            if (ban.reason) embed.setDescription(ban.reason)
            channel.send({ embeds: [embed] })
        })
	}
}