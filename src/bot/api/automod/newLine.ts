/* eslint-disable @typescript-eslint/no-empty-function */
import { Guild, Message } from "discord.js";
import Bot from "../Client";
import { promisify } from 'util';
const wait = promisify(setTimeout);

export default async (message: Message, _client: Bot, guildData: number, punishment: string): Promise<number> => {
    const newLineAmt = message.content.split(/\n$|^\n|^\s*$/m).length;
    const isgreater = newLineAmt > guildData ? true : false
    if (!isgreater) return 0;

    switch (punishment) {
        case 'Warn': {
           await message.delete().catch(() => {});
            const sentMessage = await message.channel.send(`**${message.author.tag}**, No Spamming.`)
            await wait(2000);
            await sentMessage.delete().catch(() => {});
            return 1;
        }
        case 'Delete': {
            await message.delete().catch(() => {});
            return 1;
        }
        case 'Kick': {
            await message.delete().catch(() => {});
            const sentMessage = await message.channel.send(`**${message.author.tag}**, No Spamming.\nThis Guilds Configuration includes you to get kicked, which will happen in 2 secs`)
            await wait(2000);
            await message.member?.kick(`AutoMod by Shizu! User got kicked because of of spamming a total of ${newLineAmt} newlinez`)
            await sentMessage.delete().catch(() => {});
            _client.emit('kicked', message.member, message.guild?.me, `AutoMod by Shizu! User got kicked because of spamming a total of ${newLineAmt} newlinez`);
            return 1;
        }
        break;
        case 'Mute': {
            await message.delete().catch(() => {});
            const sentMessage = await message.channel.send(`**${message.author.tag}**, No Spamming.`);
            const mrole = await _client.cache.muterole(message.guild as Guild);
            if (!mrole) return 0;
            await message.member?.roles.add(mrole).catch(() => null);
            await wait(2000);
            await sentMessage.delete().catch(() => {});
            _client.emit('muted', message.member, message.guild?.me, `Auto Muted by Shizu! The user got muted because of spamming a total of ${newLineAmt} newlinez`)
            return 1;
        }
    }
    return 0
}