const CavenBot = require('./structures/CavenBot')
const { Player } = require('discord-music-player')
const { config } = require('dotenv')

config()

const client = new CavenBot()

const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnEmpty: true,
    timeout: 60,
})

client.player = player

client.start()