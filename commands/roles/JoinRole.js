const Command = require('../../structures/Command')
const joinRoleSchema = require('../../models/joinRole')
const serverSchema = require('../../models/serverSchema')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
	constructor(client, name='joinrole') {
		super(client, name, {
			category: 'React Roles',
			description: 'Sets the role to add to newly joined members and enables it. Using this with no role will disable it',
			expectedArgs: '<role>',
			slash: true,
			data: new SlashCommandBuilder().setName('joinrole')
				.setDescription('Sets the role to add to newly joined members and enables it. Using this with no role will disable it')
				.addRoleOption((option) => option.setName('role').setDescription('The role you want to use. Ignore this if you want to disable').setRequired(false))
		})
	}

	async executeSlash(interaction) {
		await interaction.deferReply()
		const { guild } = interaction
		const role = interaction.options.getRole('role')

		if (!role) {
			const doc = await joinRoleSchema.findOne({ guildId: guild.id })
			if (!doc) {
				interaction.editReply('There is no join role set up for this server. Please tag a role in the command if you want to use join roles.')
				return
			}

			await joinRoleSchema.findOneAndDelete({ guildId: guild.id })
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: false })
			interaction.editReply('Disabled join roles for this server.')
			return
		}

		const doc = await joinRoleSchema.findOne({ guildId: guild.id })
		if (!doc) {
			await new joinRoleSchema({
				guildid: guild.id,
				role: role.id
			}).save()
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: true })
			interaction.editReply(`Join role for the server set to ${role}`)
			return
		}

		await joinRoleSchema.findOneAndUpdate({ guildId: guild.id }, { role: role.id })
		interaction.editReply(`Join role for the server set to ${role}`)
	}

	async run(message, args) {
		const { guild } = message
		let roleStr = args.shift()
		if (roleStr.startsWith('<@&'))
			roleStr = roleStr.slice(3, roleStr.length - 1)
		const role = await guild.roles.fetch(roleStr)

		if (!role) {
			const doc = await joinRoleSchema.findOne({ guildId: guild.id })
			if (!doc) {
				message.channel.send('There is no join role set up for this server. Please tag a role in the command if you want to use join roles.')
				return
			}

			await joinRoleSchema.findOneAndDelete({ guildId: guild.id })
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: false })
			message.channel.send('Disabled join roles for this server.')
			return
		}

		const doc = await joinRoleSchema.findOne({ guildId: guild.id })
		if (!doc) {
			await new joinRoleSchema({
				guildid: guild.id,
				role: role.id
			}).save()
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: true })
			message.channel.send(`Join role for the server set to ${role}`)
			return
		}

		await joinRoleSchema.findOneAndUpdate({ guildId: guild.id }, { role: role.id })
		message.channel.send(`Join role for the server set to ${role}`)
	}
}