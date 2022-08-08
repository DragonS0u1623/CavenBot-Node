const Command = require('../../structures/Command')
const adminSchema = require('../../models/admin')
const { nanoid } = require('nanoid')
const { EmbedBuilder } = require('discord.js')

module.exports = class extends Command {
	constructor(client, name='send') {
		super(client, name, {
			category: "Anon",
			description: "Sends a message anonymously in the given channel.",
			expectedArgs: "[guild] [channel] [message]",
			guildOnly: false
		})
	}

	async run(message, args) {
		if (message.guild) {
			message.channel.send(`You need to use this command in DMs with the bot.`)
			return
		}
		if (args.length < 3) {
			message.channel.send(`You need to give at least 3 arguments for this command. [GuildId] [ChannelID] and [message]`)
			return
		}
		const guildId = args.shift()
		const channelID = args.shift()
		this.client.guilds.fetch(guildId)
			.then(async (guild) => {
				guild.channels
					.fetch(channelID)
					.then(async (channel) => {
						const doc = await adminSchema.findOne({ guildId: guild.id })
						if (!doc || doc.audits === "0") {
							message.channel.send(`The guild that you are trying to use this command in doesn't have the commands set up. Try checking with the mods to enable anonymous messages`)
							return
						}
						
						guild.channels.fetch(doc.audits).then((auditChannel) => {
							if (!auditChannel) {
								message.channel.send(`The guild that you are trying to use this command in doesn't have the commands set up. Try checking with the mods to enable anonymous messages`)
								return
							}
					
							let sendMessage = args.join(" ")
					
							const anonSendID = nanoid(12)
							sendMessage += `\nAnon Sender: ${anonSendID}`
					
							channel.send(sendMessage)
								.then((m) => {
									const id = m.id
					
									const embed = new EmbedBuilder()
										.setTitle("New Anonymous Message")
										.setDescription(`A new anonymous message has been sent by ${m.author}`)
										.addFields(
											{ name: `[Channel ID](${channel.url})`, value: `${channel.id}`, inline: true },
											{ name: `[Message ID](${m.url})`, value: `${id}`, inline: true },
											{ name: `Anonymous Message ID`, value: `${anonSendID}`, inline: false }
										)
									auditChannel.send({ embeds: [embed] }).catch((err) => {
										console.log(err)
									})
					
									message.react("✅")
								})
								.catch((err) => {
									message.react("❌")
									console.log(err)
								})
						})
					})
					.catch((err) => {
						message.channel.send(`The channel ID you provided didn't give a valid channel. Please check to make sure that the ID is correct`)
						console.log(err)
					})
			})
			.catch((err) => {
				message.channel.send(`The guild ID you provided didn't give a valid guild. Please check to make sure that the ID is correct`)
				console.log(err)
			})
	}
}
