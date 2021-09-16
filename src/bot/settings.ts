import { Settings } from './types/Settings';
import 'dotenv/config'

const settings: Settings = {
	// Bot Token
	BOT_TOKEN: `${process.env.TOKEN}`,
	// owner id
	BOT_OWNER_ID: ['773193286776389653'],
	// prefix
	PREFIX: `${process.env.PREFIX}`,
	// Mongo Url
	MONGO_URL: `${process.env.MONGO_URI}`,
	// Void bot token https://voidbots.net
	VTOKEN: `${process.env.VTOKEN}`,
	// Top gg token (no use)
	TGTOKEN: `${process.env.TGTOKEN}`,
	// fortnite token (remove the interaction/fortnite slash command if u dont wanna use)
	FORTTOKEN: `${process.env.FORTTOKEN}`,
	// Monke dev (https://discord.gg/V57WB5xmuJ) get ur key by doing a!register
	MONKE: `${process.env.MONKE}`,
	// discord status api (u dont need to register as this is public)
	DISCORDSTATUSAPI: 'srhpyqt94yxb',
	// Animu api key for anifact command (https://discord.gg/yyW389c)
	ANIMU: `${process.env.ANIMU}`
};

export default settings;
