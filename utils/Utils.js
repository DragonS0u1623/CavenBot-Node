const path = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const Command = require('../structures/Command')
const Event = require('../structures/Event')
const { REST } = require('@discordjs/rest')
const { BOTID, HOMESERVERID } = require('./StaticVars')
const { Routes } = require('discord.js')

const slashcommands = []
const testCommands = []
const status = ['m?help', 'Now with music commands!', 'Back and better than ever!', 'Get support at discord.gg/6TjuPYy']

module.exports = class Utils {
    constructor(client) {
        this.client = client
    }

    updateStatus() {
		this.client.user?.setPresence({
			status: 'online',
			activities: [
				{
					name: status[Math.floor(Math.random() * status.length)]
				}
			]
		})
	
		setTimeout(this.updateStatus, 5 * 60 * 1000)
	}

    isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class'
	}

	get directory() {
		return `${path.dirname(require.main?.filename || '')}${path.sep}`.replace(/\\/g, '/')
	}

	removeDuplicates(arr) {
		return [...new Set(arr)]
	}

	checkPlayerInteraction(player, interaction) {
		if (!player.hasQueue(interaction.guild.id)) {
			interaction.editReply(`I am not in a voice channel`)
			return false
		}
		const { guild } = interaction
        const member = guild.members.resolve(interaction.user)
        if (!member.voice) {
			interaction.editReply(`You must be in a voice channel to use this command`)
			return false
		}
		const { channel } = member.voice

        if (guild.members.me.voice.channel.id !== channel?.id) {
			interaction.editReply(`You must be in the same voice channel to use this command`)
			return false
		}
		return true
	}

	checkPlayerMessage(player, message) {
		if (!player.hasQueue(message.guild.id)) {
			message.channel.send(`I am not in a voice channel`)
			return false
		}
        const { member, guild } = message
        if (!member.voice) {
			message.channel.send(`You must be in a voice channel to use this command`)
			return false
		}
        const { channel } = member.voice

        if (guild.members.me.voice.channel.id !== channel?.id) {
			message.channel.send(`You must be in the same voice channel to use this command`)
			return false
		}
		return true
	}

	async loadCommands() {
		return glob(`${this.directory}commands/**/*.js`).then((commands) => {
			for (const commandFile of commands) {
				delete require.cache[commandFile]
				const { name } = path.parse(commandFile)
				const File = require(commandFile)
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class`)
				const command = new File(this.client, name.toLowerCase())
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} is not a command object.`)
				this.client.commands.set(command.name, command)
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name)
					}
				}
				if (command.slash) {
					this.client.slashCommands.set(command.name, command)
					if (command.testOnly) testCommands.push(command.data.toJSON())
					else slashcommands.push(command.data.toJSON())
				}
			}
		})
	}

	async loadEvents() {
		return glob(`${this.directory}events/**/*.js`).then((events) => {
			for (const eventFile of events) {
				delete require.cache[eventFile]
				const { name } = path.parse(eventFile)
				const File = require(eventFile)
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class`)
				const event = new File(this.client, name)
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} is not an event object.`)
				this.client.events.set(event.name, event)
				event.emitter[event.type](name, (...args) => event.run(...args))
			}
		})
	}

	async loadTestSlashCommands() {
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
		try {
			await rest.put(
				Routes.applicationGuildCommands(BOTID, HOMESERVERID),
				{ body: testCommands }
			)
			console.log('Successfully updated Test Slash Commands')
		} catch (error) {
			console.error(error)
		}
	}

	async loadSlashCommands() {
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
		try {
			await rest.put(
				Routes.applicationCommands(BOTID),
				{ body: slashcommands }
			)
			console.log('Successfully updated slash commands')
		} catch (error) {
			console.error(error)
		}
	}
}