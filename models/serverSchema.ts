import { Schema, model } from 'mongoose'
import { reqString, reqBool, discordId } from '../structures/Types'

export type serverSettings = {
    guildId: string
	prefix: string
	welcome: boolean
	audits: boolean
	roledm: boolean
	joinrole: boolean
	customVC: boolean
}

const serverSchema = new Schema<serverSettings>({
	guildId: discordId,
	prefix: reqString,
	welcome: reqBool,
	audits: reqBool,
	roledm: reqBool,
	joinrole: reqBool,
	customVC: reqBool
})

export default model('serversettings', serverSchema)