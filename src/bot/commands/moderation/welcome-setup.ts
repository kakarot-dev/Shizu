// /* eslint-disable no-case-declarations */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { welcome as WelcomeData } from '../../mongoose/schemas/welcome';
// import Command from '../../struct/Command';
// import { Message, MessageCollector, TextChannel, NewsChannel, DMChannel } from 'discord.js';

// abstract class WelcomeChannelCommand extends Command {
// 	constructor() {
// 		super({
// 			name: 'set-welcome',
// 			aliases: [],
// 			description: 'Set a Welcome channel',
// 			usage: '<prefix>set-welcome <channel>',
// 			category: 'mods',
// 			cooldown: 120,
// 			ownerOnly: false,
// 			guildOnly: true,
// 			requiredArgs: 1,
// 			userPermissions: ['MANAGE_CHANNELS'],
// 			clientPermissions: ['ADD_REACTIONS', "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES"]
// 		});
// 	}

// 	// tslint:disable-next-line: promise-function-async
// 	public async exec(message: Message, args: string[]) {
//
// 			if (!message.guild) return
// 			if (message.channel instanceof NewsChannel || message.channel instanceof DMChannel) return message.reply({
// 				content: `Pls make sure this is a simple text channel : )`
// 			})
// 			const channel = message.channel as TextChannel;
// 			const welData = await WelcomeData.findOne({
// 				guildId: message.guild.id
// 			});

// 			if (!welData) {
// 				if (!args[0]) return message.channel.send({
// 					content: `Didnt find your data in our data base\nTry saying dm/channel for setting it up`
// 				})
// 				switch (args[0]) {
// 					case "dm":
// 						await message.channel.send({
// 							content: `Now Tell Me What to send in the DM\n** Note:** This will be set as description for the embed\n**60** secs`
// 						});

// 						const firstFilter = m => m.author.id === message.author.id;
// 						const firstCollector = new MessageCollector(channel, firstFilter, {
// 							max: 1,
// 							time: 1000 * 60,
// 						});

// 						firstCollector.on('end', async msg => {
// 							const dmmessage = msg.first();

// 							if (!dmmessage) {
// 								message.reply({
// 									content: 'You did not reply in time.'
// 								})
// 								return
// 							}
// 							await message.channel.send({
// 								content: `**Optional** Can u tell me which color u would like the embed to have.\nType exit to skip\n** Note:** Should be in full upercase or an hex digit [say RANDOM for random colors]\n**15 secs**`
// 							});
// 							const secondFilter = m => m.author.id === message.author.id;
// 							const secondCollector = new MessageCollector(channel, secondFilter, {
// 								max: 1,
// 								time: 1000 * 15,
// 							});
// 							secondCollector.on('end', async msg => {
// 								const colmessage = msg.first();
// 								if (!colmessage) {
// 									return await createWelcomeSystemdm(message, message.guild?.id, "dm", dmmessage.content, 'BLUE');
// 								}
// 								switch (colmessage.content) {
// 									case "exit":
// 										message.reply({
// 											content: 'The default color has been set to **BLUE**'
// 										})
// 										await createWelcomeSystemdm(message, message.guild?.id, "dm", dmmessage.content, 'BLUE');
// 										break;
// 									default:
// 										const colo = colmessage.content
// 										await createWelcomeSystemdm(message, message.guild?.id, "dm", dmmessage.content, colo);
// 								}
// 							});
// 						});
// 						break;
// 					case "channel":
// 						await message.channel.send({
// 							content: `Now Tell Me What to send in the channel\n** Note:** This will be set as description for the embed\n**60** secs`
// 						});

// 						const secsecondFilter = m => m.author.id === message.author.id;
// 						const secsecondCollector = new MessageCollector(channel, secsecondFilter, {
// 							max: 1,
// 							time: 1000 * 60,
// 						});

// 						secsecondCollector.on('end', async msgs => {
// 							const secchmessage = msgs.first();

// 							if (!secchmessage) {
// 								message.reply({
// 									content: 'You did not reply in time.'
// 								})
// 								return
// 							}
// 							await message.channel.send({
// 								content: `What channel do you want to send the welcome message in?\n** Note:** Channel should be tagged\n**15** secs`
// 							});
// 							const secthridFilter = m => m.author.id === message.author.id;
// 							const secthridCollector = new MessageCollector(channel, secthridFilter, {
// 								max: 1,
// 								time: 1000 * 15,
// 							});
// 							secthridCollector.on('end', async (mssgs) => {
// 								const secchannelTag = mssgs.first();
// 								if (!secchannelTag) {
// 									message.reply({
// 										content: 'You did not reply in time.'
// 									})
// 									return
// 								}
// 								const secchannelTagid = secchannelTag.mentions.channels.first();
// 								if (!secchannelTagid) {
// 									message.reply({
// 										content: 'You have not tagged a channel.'
// 									})
// 									return
// 								}
// 								await message.channel.send({
// 									content: `**Optional** Can u tell me which color u would like the embed to have.\nType exit to skip\n** Note:** Should be in full upercase or an hex digit [say RANDOM for random colors]\n**15 secs**`
// 								});
// 								const secsecondFilter = m => m.author.id === message.author.id;
// 								const secsecondCollector = new MessageCollector(channel, secsecondFilter, {
// 									max: 1,
// 									time: 1000 * 15,
// 								});
// 								secsecondCollector.on('end', async msg => {
// 									const seccolmessage = msg.first();
// 									if (!seccolmessage) {
// 										return await createWelcomeSystemchan(message, message.guild?.id, "channel", secchannelTagid.id, secchmessage.content, 'BLUE');
// 									}
// 									switch (seccolmessage.content) {
// 										case "exit":
// 											message.reply({
// 												content: 'The default color has been set to **BLUE**'
// 											})
// 											await createWelcomeSystemchan(message, message.guild?.id, "channel", secchannelTagid.id, secchmessage.content, 'BLUE');
// 											break;
// 										default:
// 											const colo = seccolmessage.content
// 											await createWelcomeSystemchan(message, message.guild?.id, "channel", secchannelTagid.id, secchmessage.content, colo);
// 									}
// 								});
// 							});
// 							return
// 						});
// 						break;
// 					case "both":
// 						await message.channel.send({
// 							content: `Now Tell Me What to send in the channel\n** Note:** This will be set as description for the embed\n**60** secs`
// 						});

// 						const thrsecondFilter = m => m.author.id === message.author.id;
// 						const thrsecondCollector = new MessageCollector(message.channel, thrsecondFilter, {
// 							max: 1,
// 							time: 1000 * 60,
// 						});

// 						thrsecondCollector.on('end', async msgs => {
// 							const thrchmessage = msgs.first();

// 							if (!thrchmessage) {
// 								message.reply({
// 									content: 'You did not reply in time.'
// 								})
// 								return
// 							}
// 							await message.channel.send({
// 								content: `What channel do you want to send the welcome message in?\n** Note:** Channel should be tagged\n**15** secs`
// 							});
// 							const thrthridFilter = m => m.author.id === message.author.id;
// 							const thrthridCollector = new MessageCollector(channel, thrthridFilter, {
// 								max: 1,
// 								time: 1000 * 15,
// 							});
// 							thrthridCollector.on('end', async mssgs => {
// 								const thrchannelTag = mssgs.first();
// 								if (!thrchannelTag) {
// 									message.reply({
// 										content: 'You did not reply in time.'
// 									})
// 									return
// 								}
// 								const thrchannelTagid = thrchannelTag.mentions.channels.first();
// 								if (!thrchannelTagid) {
// 									message.reply({
// 										content: 'You have not tagged a channel.'
// 									})
// 									return
// 								}
// 								await message.channel.send({
// 									content: `**Optional** Can u tell me which color u would like the embed to have.\nType exit to skip\n** Note:** Should be in full upercase or an hex digit [say RANDOM for random colors]\n**15 secs**`
// 								});
// 								const thrsecondFilter = m => m.author.id === message.author.id;
// 								const thrsecondCollector = new MessageCollector(channel, thrsecondFilter, {
// 									max: 1,
// 									time: 1000 * 15,
// 								});
// 								thrsecondCollector.on('end', async msg => {
// 									const thrcolmessage = msg.first();
// 									if (!thrcolmessage) {
// 										return await createWelcomeSystemchan(message, message.guild?.id, "both", thrchannelTagid.id, thrchmessage.content, 'BLUE');
// 									}
// 									switch (thrcolmessage.content) {
// 										case "exit":
// 											message.reply('The default color has been set to **BLUE**')
// 											await createWelcomeSystemboth(message, message.guild?.id, "both", thrchannelTagid.id, thrchmessage.content, 'BLUE');
// 											break;
// 										default:
// 											const colo = thrcolmessage.content
// 											await createWelcomeSystemboth(message, message.guild?.id, "both", thrchannelTagid.id, thrchmessage.content, colo);
// 									}
// 								});
// 							});
// 							return
// 						});
// 						break;
// 					default:
// 						message.channel.send({
// 							content: `Pls say **dm/channel/both** to set it up`
// 						})
// 				}
// 			} else if (welData) {
// 				await WelcomeData.findOneAndRemove({
// 					GuildID: message.guild.id
// 				});
// 				message.channel.send({
// 					content: `**Successfuly Reset the Welcome System on your Server!**\npls use this command again to re-setup!`
// 				});
// 			}
// 		} catch (err) {
// 			this.client.logs(message, err, "error");
// 		}
// 	}
// }
// export default WelcomeChannelCommand;
// async function createWelcomeSystemdm(messageobj, guild, type, message, color) {
// 	const newData = new WelcomeData({
// 		guildId: guild,
// 		dmchan: type,
// 		message: message,
// 		color: color
// 	});
// 	newData.save();
// 	await messageobj.channel.send({
// 		content: `Data saved successfully [Optional is set to: ${color}]`
// 	})
// }

// async function createWelcomeSystemchan(messageobj, guild, type, channel, message, color) {
// 	const newData = new WelcomeData({
// 		guildId: guild,
// 		dmchan: type,
// 		channelId: channel,
// 		message: message,
// 		color: color
// 	});
// 	newData.save();
// 	await messageobj.channel.send({
// 		content: `Data saved successfully [Optional is set to: ${color}]`
// 	})
// }

// async function createWelcomeSystemboth(messageobj, guild, type, channel, message, color) {
// 	const newData = new WelcomeData({
// 		guildId: guild,
// 		dmchan: type,
// 		channelId: channel,
// 		message: message,
// 		color: color
// 	});
// 	newData.save();
// 	await messageobj.channel.send({
// 		content: `Data saved successfully [Optional is set to: ${color}]`
// 	})
// }
