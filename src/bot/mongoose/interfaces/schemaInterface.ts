/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

export interface IAfk extends mongoose.Document<any> {
	guildId: string;
	userId: string;
	afk: string;
	timestamp: number;
	username: string;
}
export interface IMuteRole extends mongoose.Document<any> {
	guildId: string;
	muteRole: string;
}

export interface IMute extends mongoose.Document<any> {
	userId: string;
	reason: string;
	guildId: string;
	staffId: string;
	staffTag: string;
	expires: Date;
}

export interface ISchedule extends mongoose.Document<any> {
	date: number;
	content: string;
	guildId: string;
	channelId: string;
}

export interface ISuggest extends mongoose.Document<any> {
	guildId: string;
	channelId: string;
}

export interface IWelcome extends mongoose.Document<any> {
	guildId: string;
	dmchan: string;
	channelId: string;
	message: string;
	color: string;
}

export interface Iprefix extends mongoose.Document<any> {
	gId: string;
	prefix: string;
}

export interface IDiscord_Status extends mongoose.Document<any> {
	guildId: string;
	channelId: string;
}

// export interface IIsPremiumGuild extends mongoose.Document<any> {
// 	guildId: string;
// }

// export interface IGuildWatchList extends mongoose.Document<any> {
// 	_id: string;
// 	channelId: string;
// }