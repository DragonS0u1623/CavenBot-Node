import { Schema, model } from 'mongoose'
import { reqString, discordId } from '../structures/Types'

export type joinRole = {
    guildId: string,
    role: string
}

const joinRoleSchema = new Schema<joinRole>({
	guildId: discordId,
	role: reqString
})

export default model('joinrole', joinRoleSchema)