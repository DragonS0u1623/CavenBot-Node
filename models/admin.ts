import { Schema, model } from 'mongoose'
import { reqString, discordId } from '../structures/Types';

export type admin = {
    guildId: string,
	audits: string,
	welcome: string,
	welcome_message: string,
	language: string,
	customVC: string
}

const adminSchema = new Schema<admin>({
	guildId: discordId,
	audits: reqString,
	welcome: reqString,
	welcome_message: reqString,
	language: reqString,
	customVC: reqString
})

export default model('admin', adminSchema)