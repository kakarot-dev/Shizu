/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from '../../struct/Command';
import { Message } from 'discord.js';
abstract class RestartCommand extends Command {
	protected constructor() {
		super({
			name: 'restart',
			aliases: [],
			description: 'restart the bot',
			usage: '<prefix>restart',
			category: 'Devs',
			cooldown: 2,
			ownerOnly: true,
			guildOnly: false,
			requiredArgs: 0,
			userPermissions: [],
			clientPermissions: []
		});
	}

	public async exec(message: Message) {
	await message.channel.send({
		content: `Restarting Bot`
	})
    process.exit()
	}
}
export default RestartCommand;

