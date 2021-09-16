/* eslint-disable @typescript-eslint/no-empty-function */
import { Message } from "discord.js";
import Bot from "../Client";
import { promisify } from 'util';
const wait = promisify(setTimeout);
import geturls from 'get-urls';

// eslint-disable-next-line @typescript-eslint/ban-types
export default async (message: Message, _client: Bot, guildData: Array<string>, punishment: string): Promise<number> => {
    const linksAmt = geturls(message.content, {
        exclude: ['message', 'discord', ...guildData],
        requireSchemeOrWww: true
    }).size
    const isbeenPunisched = linksAmt ? true : false
    if (!isbeenPunisched) return 0;
    switch (punishment) {
        case 'Warn': {
            await message.delete().catch(() => { });
            const sentMessage = await message.channel.send(`**${message.author.tag}**, That link is not allowed`)
            await wait(2000);
            await sentMessage.delete().catch(() => { });
            return 1;
        }
        case 'Delete': {
            await message.delete().catch(() => { });
            return 1;
        }
    }
    return 0;
}