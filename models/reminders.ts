import { Schema, model } from 'mongoose'
import { reqString, reqNum, discordId } from '../structures/Types'

export type reminders = {
    guildId: string
    userId: string
    reminders: reminder[]
}

type reminder = {
    num: number
    reminder: string
}

const remindSchema = new Schema<reminders>({
	guildId: discordId,
	userId: reqString,
	reminders: [
		{
			num: reqNum,
			reminder: reqString
		}
	]
})

export default model('reminders', remindSchema)