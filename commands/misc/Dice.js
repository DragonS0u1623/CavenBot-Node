const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(client, name='dice') {
        super(client, name, {
            aliases: ['d'],
            category: 'Misc',
            description: 'Rolls a dice with the amount of sides given. Default is a normal 6-sided dice',
            expectedArgs: '[sides]',
            slash: true,
            data: new SlashCommandBuilder()
                .setName('dice')
                .setDescription('Rolls a dice with the amount of sides given. Default is a normal 6-sided dice')
                .addIntegerOption(option => option.setName('sides').setDescription('The number of sides').setRequired(false))
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()

        const sides = interaction.options.getInteger('sides') || 6
        let message = ''

        const roll = Math.floor(Math.random() * sides) + 1

        if (roll === 1 && sides === 20)
            message = `${interaction.user} rolled a d20. They got a 1. It's a critical fail!`
        else if (roll === sides && sides === 20)
            message = `${interaction.user} rolled a d20. They got a nat 20!`
        else
            message = `${interaction.user} rolled a d${sides}. They got a ${roll}`

        interaction.editReply(message)
    }

    async run(message, args) {
        let sides = 6
        let send = ''
        if (args) sides = parseInt(args[0])

        const roll = Math.floor(Math.random() * sides) + 1

        if (roll === 1 && sides === 20)
            send = `${message.author} rolled a d20. They got a 1. It's a critical fail!`
        else if (roll === sides && sides === 20)
            send = `${message.author} rolled a d20. They got a nat 20!`
        else
            send = `${message.author} rolled a d${sides}. They got a ${roll}`
        message.channel.send(send)
    }
}