const Event = require('../../structures/Event')
const { Colors, EmbedBuilder } = require('discord.js')
const serverSchema = require('../../models/serverSchema')
const adminSchema = require('../../models/admin')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Event {
    constructor(client, name='guildMemberAdd') {
		super(client, name)
	}

	async run(member) {
        const { guild } = member
        const serverSettings = await serverSchema.findOne({ guildId: guild.id })
        const { audits, welcome, joinrole } = serverSettings
        if ((!audits && !welcome && !joinrole) || member.user.bot) return

        const admin = await adminSchema.findOne({ guildId: guild.id })

        if (audits) {
            guild.channels.fetch(admin.audits).then((channel) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Member Joined: ${member}`)
                    .setDescription(`Joined the server`)
                    .setThumbnail(`${member.avatarURL()}`)
                    .setColor(Colors.Green)
                    .setTimestamp()
                    .addFields(
                        { name: `Joined at`, value: `<t:${member.joinedTimestamp}>`, inline: false },
                        { name: `Created at`, value: `<t:${member.user.createdTimestamp}>`, inline: false })
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                
                const now = moment()
                const createDate = moment(member.user.createdAt)
                
                if (createDate.add(2, 'weeks').isAfter(now)) embed.addFields({ name: ':warning:Warning! This account is under 2 weeks old. Be careful!:warning:', value: '', inline: false })
                channel.send({ embeds: [embed] })
            })
        }

        if (welcome) {
            guild.channels.fetch(admin.welcome).then((channel) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Member Joined: ${member}`)
                    .setDescription(`${admin.welcome_message}`)
                    .setColor(Colors.Green)
                    .setThumbnail(member.avatarURL())
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                channel.send({ embeds: [embed] })
            })
        }

        if (joinrole) {
            const joinrole = await joinRoleSChema.findOne({ guildId: guild.id })
            const role = await guild.roles.fetch(joinrole.role)
            if (!member.manageable) return
            await member.roles.add(role)
        }
	}
}