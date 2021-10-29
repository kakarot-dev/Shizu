/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
    Guild,
    Message,
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu,
    MessageComponentInteraction,
    Collection,
    MessageButton,
    TextChannel,
    SelectMenuInteraction, Role
} from "discord.js";
import {stripIndents} from "common-tags";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const emojis = require('../../../../emojis.json')

export type guild = {
    id: bigint;
    statusChannelId?:  string | null;
    modLogsChannelId?: string | null;
    muteRoleId?: string | null;
    prefix?: string | null;
    suggestChannelId?: string | null;
    ioc?: boolean | null;
    waifu: string | null;
    modRoles?: string[] | null;
    autoMod?: any;
}

enum module_names {
    WAIFU = "waifu",
    IOC = "ioc",
    MODR = "modRoles",
    DSTATUS = "statusChannelId",
    MLOGS = "modLogsChannelId",
    SUGGEST = "suggestChannelId",
    MUTER = "muteRoleId",
    PREFIX =  "prefix"
}
abstract class SettingsCommand extends Command {
    protected constructor() {
        super({
            name: "settings",
            aliases: [],
            description: "Alter the settings of a guild",
            usage: "<prefix>settings",
            category: "mods",
            cachedData: true,
            cooldown: 10,
            ownerOnly: false,
            guildOnly: true,
            requiredArgs: 0,
            userPermissions: [],
            // clientPermissions: ["MANAGE_GUILD", "MANAGE_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
        });
    }
    private messages: Collection<string, Message> = new Collection<string, Message>();
    private selected_channel:  Collection<string, TextChannel> = new Collection<string, TextChannel>();
    private selected_role: Collection<string, Role[] | Role> = new Collection<string, Role[] | Role>()
    public async exec(message: Message): Promise<void> {
        const get_msg = this.messages.get(message.guild?.id as string);
        if (get_msg) {
            await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Command not allowed`)
                        .setDescription(`The command is already in use by a mod **[here](https://discord.com/channels/${get_msg.guild?.id}/${get_msg.channel.id}/${get_msg.id} "message link")**`)
                        .setColor('RED')
                ]
            })
            return
        }
        if (message.member?.permissions.has('MANAGE_GUILD')) this.messages.set(message.guild?.id as string, message)
        await this.init(message);
    }
    async init(message: Message): Promise<Message> {
        const filter = async (interaction: MessageComponentInteraction) => {
            const value: string = (interaction as SelectMenuInteraction).values[0].toUpperCase()
            const module: string = module_names[value]
            if (!module) {
                await interaction.reply({
                    content: `I havent cached this menu. Please choose another option`,
                    ephemeral: true,
                });
                return false
            }
            if (interaction.user.id !== message.author.id) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const data = this.client.cache.getData(message.guild?.id);
        const embed_1 = this.create_embed_1(data as guild, message.guild as Guild, false)
        const select_menus_1 = this.create_select_menus_1(false)
        const message_1 = await message.channel.send({
            embeds: [embed_1],
            components: message.member?.permissions.has('MANAGE_GUILD') ? [select_menus_1] : []
        })
        if (!message.member?.permissions.has('MANAGE_GUILD')) return message_1;
        const collector = message_1.createMessageComponentCollector({
            filter,
            time: 1000 * 60,
            max: 1
        })
        collector.on('end', async (collection: Collection<string, SelectMenuInteraction>) => {
            const customId: string | undefined = collection.first()?.values[0]
            const interaction = collection.first()
            if (!customId || !interaction) {
                await message_1.edit({
                    embeds: [this.create_embed_1(data as guild, message.guild as Guild, true)],
                    components: [this.create_select_menus_1(true)]
                });
                this.messages.delete(`${message.guild?.id as string}`);
            }
            else {
                const to_save = module_names[customId.toUpperCase()] as string;
                switch (to_save) {
                    case "waifu": await this.waifu_save(data as guild, interaction);
                        break;
                    case "statusChannelId": await this.dstatus_save(data as guild, interaction);
                        break;
                    case "modLogsChannelId": await this.logs_save(data as guild, interaction);
                        break;
                    case "suggestChannelId": await this.suggest_save(data as guild, interaction);
                        break;
                    case "prefix": await this.prefix_save(data as guild, interaction);
                        break;
                    case "ioc": await this.ioc_save(data as guild, interaction);
                        break;
                    case "muteRoleId": await this.mute_save(data as guild, interaction);
                        break;
                    // case "modRoles": await this.modr_save(data as guild, interaction);
                    //     break;
                }
            }
        })
        return message_1
    }
    create_embed_1 (data: guild, guild: Guild, end: boolean): MessageEmbed {
        const embed_1 = new MessageEmbed()
            .setTitle(`Settings of ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }) as string)
            .setDescription(`This embed shows the settings of the Guild.`)
            .addFields([
                {
                    name: "Prefix",
                    value: stripIndents(`
                         ${data.prefix === process.env.PREFIX ? `**${data.prefix}** (Default)` : `**${data.prefix}** (Custom)`}
                        `),
                    inline: true
                },
                {
                    name: "Waifu",
                    value: stripIndents(`
                    ${data.waifu ? `${emojis.yea} <#${data.waifu}>` : `${emojis.wrong} Disabled`}
                    `),
                    inline: true
                },
                {
                    name: "Code to Image",
                    value: stripIndents(`
                    ${data.ioc ? `${emojis.yea} Enabled` : `${emojis.wrong} Disabled`}
                    `),
                    inline: true
                },
                {
                    name: "Discord Status",
                    value: stripIndents(`
                    ${data.statusChannelId ? `${emojis.yea} <#${data.statusChannelId}>` : `${emojis.wrong} Disabled`}
                    `),
                    inline: true
                },
                {
                    name: "Mod Logs",
                    value: stripIndents(`
                        ${data.modLogsChannelId ? `${emojis.yea} <#${data.modLogsChannelId}>` : `${emojis.wrong} Disabled`}
                        `),
                    inline: true
                },
                {
                    name: "Suggestions",
                    value: stripIndents(`
                        ${data.suggestChannelId ? `${emojis.yea} <#${data.suggestChannelId}>` : `${emojis.wrong} Disabled`}
                        `),
                    inline: true
                },
                {
                    name: "AutoMod",
                    value: stripIndents(`
                       SOON:tm:
                        `),
                    inline: true
                },
                {
                    name: "Mute Role",
                    value: stripIndents(`
                       ${data.muteRoleId ? `${emojis.yea} <@&${data.muteRoleId}>` : `${emojis.wrong} Disabled`}
                        `),
                    inline: true
                },
                // {
                //     name: "Mod Roles",
                //     value: stripIndents(`
                //        ${data.modRoles?.length ? `${data.modRoles.map<string>(id => `<@&${id}>`).join(' ')}` : `${emojis.wrong} Disabled`}
                //         `),
                //     inline: (data.modRoles?.length || 0) < 1
                // }
            ])
            .setColor(end ? "RED" : "GREEN")
            .setFooter(`GuildID: ${guild.id}`)
        return embed_1
    }
    create_select_menus_1(end: boolean): MessageActionRow {
        const select_menus_1 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setDisabled(end)
                    .setPlaceholder(end ? 'Use the command again' : 'Select a option to edit')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setCustomId('settings')
                    .addOptions([
                        {
                            label: "Prefix",
                            description: "Set a new prefix",
                            value: "prefix",
                            emoji: emojis.settings.prefix
                        },
                        {
                            label: "Waifu",
                            description: "Set a waifu channel",
                            value: "waifu",
                            emoji: emojis.settings.waifu
                        },
                        {
                            label: "Code to image",
                            description: "Enable the image to code feature",
                            value: "ioc",
                            emoji: emojis.settings.codetoimage
                        },
                        {
                            label: "Discord Status",
                            description: "Set a channel to post updates on discord status",
                            value: "dstatus",
                            emoji: emojis.settings.status
                        },
                        {
                            label: "Mod Logs",
                            description: "Set a channel for Mod Logs",
                            value: "mlogs",
                            emoji: emojis.settings.logs
                        },
                        {
                            label: "Suggestions",
                            description: "Set a channel for suggestions",
                            value: "suggest",
                            emoji: emojis.settings.suggest
                        },
                        {
                            label: "Mute Roles",
                            description: "Set a mute role in this server",
                            value: "muter",
                            emoji: emojis.settings.mute
                        },
                        // {
                        //     label: "Mod Roles",
                        //     description: "Add roles to use mod commands",
                        //     value: "modr",
                        //     emoji: emojis.settings.mod
                        // }
                    ])
            )
        return select_menus_1
    }
    async waifu_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                (interaction.customId === "enable" ||
                    interaction.customId === "disable") &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const waifu_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Waifu Module")
            .setDescription(stripIndents(`
            This Module send a cute pic of a waifu from waifu.pics everyday to for everyone to enjoy ${emojis.smirk}.
            The time is based on the dedi's timezone.
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setDisabled(!!data.waifu)
                    .setLabel('Enable')
                    .setStyle('SUCCESS')
                    .setCustomId('enable'),
                new MessageButton()
                    .setDisabled(!data.waifu)
                    .setLabel('Disable')
                    .setStyle('DANGER')
                    .setCustomId('disable')
            ])
        await message.edit({
            embeds: [waifu_embed],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                switch (decision) {
                    case 'enable': {
                        const msg_filter = async (coll_message: Message) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            if (coll_message.author.id !== get_msg.author.id) return false;
                            const channel = (coll_message.mentions.channels.first() || await coll_message.guild?.channels.fetch(coll_message.content)) as TextChannel;
                            if ((!channel || !channel.guild || channel.type !== "GUILD_TEXT") && coll_message.content !== "exit") {
                                await coll_message.reply({
                                    content: `I cannot find the channel you have specified! Make sure its a text channel`
                                });
                                return false;
                            }
                            if (coll_message.content !== "exit") this.selected_channel.set(`${channel.guild.id}`, channel as TextChannel)
                            return true
                        }
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Setting a Channel for the waifu Module**\n\nPlease send a channel mention  or its id.')
                                    .setColor('DARK_BLUE')
                                    .setFooter(`Type exit to leave the menu`)
                            ],
                            components: []
                        });
                        const msg_collector = message.channel.createMessageCollector({
                            filter: msg_filter,
                            time: 1000 * 60,
                            max: 1
                        })
                        msg_collector.on('end', async (collection: Collection<string, Message>) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            const msg = collection.first()?.content;
                            const is_exit: boolean = msg === "exit"
                            if (!msg || is_exit) {
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                            if (!this.selected_channel) throw {
                                message: "Code erroring in line 285"
                            }
                            const get_channel = this.selected_channel.get(`${message.guild?.id}`)
                            const saved_data = await this.client.prisma.server.update({
                                where: {
                                    id: BigInt(message.guild?.id as string)
                                },
                                data: {
                                    waifu: get_channel?.id
                                }
                            }).catch(() => null);
                            if (!saved_data) {
                                message.channel.send({
                                    embeds: [
                                        {
                                            title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                            color: "RED"
                                        }
                                    ],
                                    components: []
                                })
                            }
                            else {
                                this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                                this.selected_channel.delete(`${saved_data.id}`)
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                        })
                    }
                        break;
                    case 'disable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`) as Message
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Disabling the waifu module now.**')
                                    .setColor('RED')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                waifu: null
                            }
                        })
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        this.selected_channel.delete(`${saved_data.id}`)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                    }
                        break;

                }
            }
        })
    }
    async dstatus_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                (interaction.customId === "enable" ||
                    interaction.customId === "disable") &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const dstatus_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Discord Status Module")
            .setDescription(stripIndents(`
            This Module sends a message to a channel ( configureable ) when [discord's status page is updated](https://discordstatus.com "statuspage").
            Webhooks are used to send the message to prevent ratelimits.
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setDisabled(!!data.statusChannelId)
                    .setLabel('Enable')
                    .setStyle('SUCCESS')
                    .setCustomId('enable'),
                new MessageButton()
                    .setDisabled(!data.statusChannelId)
                    .setLabel('Disable')
                    .setStyle('DANGER')
                    .setCustomId('disable')
            ])
        await message.edit({
            embeds: [dstatus_embed],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                switch (decision) {
                    case 'enable': {
                        const msg_filter = async (coll_message: Message) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            if (coll_message.author.id !== get_msg.author.id) return false;
                            const channel = (coll_message.mentions.channels.first() || await coll_message.guild?.channels.fetch(coll_message.content)) as TextChannel;
                            if ((!channel || !channel.guild || channel.type !== "GUILD_TEXT") && coll_message.content !== "exit") {
                                await coll_message.reply({
                                    content: `I cannot find the channel you have specified! Make sure its a text channel`
                                });
                                return false;
                            }
                            if (coll_message.content !== "exit") this.selected_channel.set(`${channel.guild.id}`, channel as TextChannel)
                            return true
                        }
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Setting a Channel for the Dstatus Module**\n\nPlease send a channel mention  or its id.')
                                    .setColor('DARK_BLUE')
                                    .setFooter(`Type exit to leave the menu`)
                            ],
                            components: []
                        });
                        const msg_collector = message.channel.createMessageCollector({
                            filter: msg_filter,
                            time: 1000 * 60,
                            max: 1
                        })
                        msg_collector.on('end', async (collection: Collection<string, Message>) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            const msg = collection.first()?.content;
                            const is_exit: boolean = msg === "exit"
                            if (!msg || is_exit) {
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                            if (!this.selected_channel) throw {
                                message: "Code erroring in line 285"
                            }
                            const get_channel = this.selected_channel.get(`${message.guild?.id}`)
                            const saved_data = await this.client.prisma.server.update({
                                where: {
                                    id: BigInt(message.guild?.id as string)
                                },
                                data: {
                                    statusChannelId: get_channel?.id
                                }
                            }).catch(() => null);
                            if (!saved_data) {
                                message.channel.send({
                                    embeds: [
                                        {
                                            title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                            color: "RED"
                                        }
                                    ],
                                    components: []
                                })
                            }
                            else {
                                this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                                this.selected_channel.delete(`${saved_data.id}`)
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                        })
                    }
                        break;
                    case 'disable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`) as Message
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Disabling the Dstatus module now.**')
                                    .setColor('RED')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                statusChannelId: null
                            }
                        })
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        this.selected_channel.delete(`${saved_data.id}`)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                    }
                        break;

                }
            }
        })
    }
    async logs_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                (interaction.customId === "enable" ||
                    interaction.customId === "disable") &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const log_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("ModLog Module")
            .setDescription(stripIndents(`
            The ModLog Log module allows you to keep track of all the different things happening within your server, from message deletions to members joining and leaving.
            Shizu will help you and your moderators keep track of the changes happening inside of your server.
            Webhooks are used to send the message to prevent ratelimits.
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setDisabled(!!data.modLogsChannelId)
                    .setLabel('Enable')
                    .setStyle('SUCCESS')
                    .setCustomId('enable'),
                new MessageButton()
                    .setDisabled(!data.modLogsChannelId)
                    .setLabel('Disable')
                    .setStyle('DANGER')
                    .setCustomId('disable')
            ])
        await message.edit({
            embeds: [log_embed],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                switch (decision) {
                    case 'enable': {
                        const msg_filter = async (coll_message: Message) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            if (coll_message.author.id !== get_msg.author.id) return false;
                            const channel = (coll_message.mentions.channels.first() || await coll_message.guild?.channels.fetch(coll_message.content)) as TextChannel;
                            if ((!channel || !channel.guild || channel.type !== "GUILD_TEXT") && coll_message.content !== "exit") {
                                await coll_message.reply({
                                    content: `I cannot find the channel you have specified! Make sure its a text channel`
                                });
                                return false;
                            }
                            if (coll_message.content !== "exit") this.selected_channel.set(`${channel.guild.id}`, channel as TextChannel)
                            return true
                        }
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Setting a Channel for the ModLogs Module**\n\nPlease send a channel mention  or its id.')
                                    .setColor('DARK_BLUE')
                                    .setFooter(`Type exit to leave the menu`)
                            ],
                            components: []
                        });
                        const msg_collector = message.channel.createMessageCollector({
                            filter: msg_filter,
                            time: 1000 * 60,
                            max: 1
                        })
                        msg_collector.on('end', async (collection: Collection<string, Message>) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            const msg = collection.first()?.content;
                            const is_exit: boolean = msg === "exit"
                            if (!msg || is_exit) {
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                            if (!this.selected_channel) throw {
                                message: "Code erroring in line 285"
                            }
                            const get_channel = this.selected_channel.get(`${message.guild?.id}`)
                            const saved_data = await this.client.prisma.server.update({
                                where: {
                                    id: BigInt(message.guild?.id as string)
                                },
                                data: {
                                    modLogsChannelId: get_channel?.id
                                }
                            }).catch(() => null);
                            if (!saved_data) {
                                message.channel.send({
                                    embeds: [
                                        {
                                            title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                            color: "RED"
                                        }
                                    ],
                                    components: []
                                })
                            }
                            else {
                                this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                                this.selected_channel.delete(`${saved_data.id}`)
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                        })
                    }
                        break;
                    case 'disable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`) as Message
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Disabling the ModLogs module now.**')
                                    .setColor('RED')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                modLogsChannelId: null
                            }
                        })
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        this.selected_channel.delete(`${saved_data.id}`)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                    }
                        break;

                }
            }
        })
    }
    async suggest_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                (interaction.customId === "enable" ||
                    interaction.customId === "disable") &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const suggest_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Suggest Module")
            .setDescription(stripIndents(`
            Allow members to suggest stuff for the server by setting a specific channel aside for suggestions.
            Members can suggest using the slash command or just by typing in that channel.
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setDisabled(!!data.suggestChannelId)
                    .setLabel('Enable')
                    .setStyle('SUCCESS')
                    .setCustomId('enable'),
                new MessageButton()
                    .setDisabled(!data.suggestChannelId)
                    .setLabel('Disable')
                    .setStyle('DANGER')
                    .setCustomId('disable')
            ])
        await message.edit({
            embeds: [suggest_embed],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                switch (decision) {
                    case 'enable': {
                        const msg_filter = async (coll_message: Message) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            if (coll_message.author.id !== get_msg.author.id) return false;
                            const channel = (coll_message.mentions.channels.first() || await coll_message.guild?.channels.fetch(coll_message.content)) as TextChannel;
                            if ((!channel || !channel.guild || channel.type !== "GUILD_TEXT") && coll_message.content !== "exit") {
                                await coll_message.reply({
                                    content: `I cannot find the channel you have specified! Make sure its a text channel`
                                });
                                return false;
                            }
                            if (coll_message.content !== "exit") this.selected_channel.set(`${channel.guild.id}`, channel as TextChannel)
                            return true
                        }
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Setting a Channel for the Suggest Module**\n\nPlease send a channel mention  or its id.')
                                    .setColor('DARK_BLUE')
                                    .setFooter(`Type exit to leave the menu`)
                            ],
                            components: []
                        });
                        const msg_collector = message.channel.createMessageCollector({
                            filter: msg_filter,
                            time: 1000 * 60,
                            max: 1
                        })
                        msg_collector.on('end', async (collection: Collection<string, Message>) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            const msg = collection.first()?.content;
                            const is_exit: boolean = msg === "exit"
                            if (!msg || is_exit) {
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                            if (!this.selected_channel) throw {
                                message: "Code erroring in line 285"
                            }
                            const get_channel = this.selected_channel.get(`${message.guild?.id}`)
                            const saved_data = await this.client.prisma.server.update({
                                where: {
                                    id: BigInt(message.guild?.id as string)
                                },
                                data: {
                                    suggestChannelId: get_channel?.id
                                }
                            }).catch(() => null);
                            if (!saved_data) {
                                message.channel.send({
                                    embeds: [
                                        {
                                            title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                            color: "RED"
                                        }
                                    ],
                                    components: []
                                })
                            }
                            else {
                                this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                                this.selected_channel.delete(`${saved_data.id}`)
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                        })
                    }
                        break;
                    case 'disable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`) as Message
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Disabling the waifu module now.**')
                                    .setColor('RED')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                suggestChannelId: null
                            }
                        })
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        this.selected_channel.delete(`${saved_data.id}`)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                    }
                        break;

                }
            }
        })
    }
    async prefix_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                interaction.customId === "set" &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const prefix_save = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Custom prefix")
            .setDescription(stripIndents(`
            Set a custom prefix for the server.
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setLabel('New Prefix')
                    .setStyle('SUCCESS')
                    .setCustomId('set')
            ])
        await message.edit({
            embeds: [prefix_save],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                const msg_filter = async (coll_message: Message) => {
                    const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                    if (coll_message.author.id !== get_msg.author.id) return false;
                    if (message.content.length >= 20 ||  message.content === data.prefix) {
                        await coll_message.reply({
                            content: `This prefix is too long or this is equal to the old prefix! Please choose aother prefix`
                        });
                        return false;
                    }
                    return true
                }
                await message.edit({
                    embeds: [
                        new MessageEmbed()
                            .setDescription('**Setting a new prefix!**\n\nPlease send a prefix that is less than 20 charecters')
                            .setColor('DARK_BLUE')
                            .setFooter(`Type exit to leave the menu`)
                    ],
                    components: []
                });
                const msg_collector = message.channel.createMessageCollector({
                    filter: msg_filter,
                    time: 1000 * 60,
                    max: 1
                })
                msg_collector.on('end', async (collection: Collection<string, Message>) => {
                    const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                    const msg = collection.first()?.content;
                    const is_exit: boolean = msg === "exit"
                    if (!msg || is_exit) {
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                        return
                    }
                    const saved_data = await this.client.prisma.server.update({
                        where: {
                            id: BigInt(message.guild?.id as string)
                        },
                        data: {
                            prefix: msg
                        }
                    }).catch(() => null);
                    if (!saved_data) {
                        message.channel.send({
                            embeds: [
                                {
                                    title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                    color: "RED"
                                }
                            ],
                            components: []
                        })
                    }
                    else {
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                        return
                    }
                })
            }
        })
    }
    async ioc_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                (interaction.customId === "enable" ||
                    interaction.customId === "disable") &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const ioc_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("IOC Module")
            .setDescription(stripIndents(`
            The ioc module will detect messages starting with \`\`\` and make a image with with the content inside of it
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setDisabled(!!data.ioc)
                    .setLabel('Enable')
                    .setStyle('SUCCESS')
                    .setCustomId('enable'),
                new MessageButton()
                    .setDisabled(!data.ioc)
                    .setLabel('Disable')
                    .setStyle('DANGER')
                    .setCustomId('disable')
            ])
        await message.edit({
            embeds: [ioc_embed],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                switch (decision) {
                    case 'enable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`)
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Enabling the Ioc module..**')
                                    .setColor('DARK_BLUE')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                ioc: true
                            }
                        }).catch(() => null);
                        if (!saved_data) {
                            message.channel.send({
                                embeds: [
                                    {
                                        title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                        color: "RED"
                                    }
                                ],
                                components: []
                            })
                        }
                        else {
                            this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                            this.selected_channel.delete(`${saved_data.id}`)
                            await message.delete();
                            this.messages.delete(`${message.guild?.id as string}`);
                            await this.exec(get_msg as Message);
                            return
                        }
                    }
                        break;
                    case 'disable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`) as Message
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Disabling the IOC module now.**')
                                    .setColor('RED')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                ioc: false
                            }
                        })
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        this.selected_channel.delete(`${saved_data.id}`)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                    }
                        break;

                }
            }
        })
    }
    async mute_save(data: guild, interaction: MessageComponentInteraction) {
        const button_filter = async (interaction: MessageComponentInteraction) => {
            const get_id = this.messages.get(interaction.guild?.id as string)
            if (
                (interaction.customId === "enable" ||
                    interaction.customId === "disable") &&
                interaction.user.id !== get_id?.author.id
            ) {
                await interaction.reply({
                    content: `You cant use this. If you are a mod, Please use the command by youself.`,
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };
        const message = interaction.message as Message
        const mute_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Mute Role")
            .setDescription(stripIndents(`
            This section allows you to set a mute role for the "mute" command
            `))
        const buttons = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setDisabled(!!data.muteRoleId)
                    .setLabel('Set')
                    .setStyle('SUCCESS')
                    .setCustomId('enable'),
                new MessageButton()
                    .setDisabled(!data.muteRoleId)
                    .setLabel('Remove')
                    .setStyle('DANGER')
                    .setCustomId('disable')
            ])
        await message.edit({
            embeds: [mute_embed],
            components: [buttons]
        });
        const button_collector = message.createMessageComponentCollector({
            filter: button_filter,
            time: 1000 * 15,
            max: 1
        })
        button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const decision = collection.first()?.customId;
            const message_rev = collection.first()?.message as Message;
            if (!decision || !message_rev) {
                const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                await message.delete();
                this.messages.delete(`${message.guild?.id as string}`);
                await this.exec(get_msg);
                return
            }
            else {
                switch (decision) {
                    case 'enable': {
                        const msg_filter = async (coll_message: Message) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            if (coll_message.author.id !== get_msg.author.id) return false;
                            const role = (coll_message.mentions.roles.first() || await coll_message.guild?.roles.fetch(coll_message.content));
                            if (!role && coll_message.content !== "exit") {
                                await coll_message.reply({
                                    content: `I cannot find the Role you have specified! Make sure its a Role below ${this.client.user.username}'s highest role`
                                });
                                return false;
                            }
                            if (coll_message.content !== "exit") this.selected_role.set(`${role?.guild.id}`, role as Role)
                            return true
                        }
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Setting a Role for the mute command**\n\nPlease send a Role mention or its id.')
                                    .setColor('DARK_BLUE')
                                    .setFooter(`Type exit to leave the menu`)
                            ],
                            components: []
                        });
                        const msg_collector = message.channel.createMessageCollector({
                            filter: msg_filter,
                            time: 1000 * 60,
                            max: 1
                        })
                        msg_collector.on('end', async (collection: Collection<string, Message>) => {
                            const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
                            const msg = collection.first()?.content;
                            const is_exit: boolean = msg === "exit"
                            if (!msg || is_exit) {
                                await message.delete();
                                this.messages.delete(`${message.guild?.id as string}`);
                                await this.exec(get_msg);
                                return
                            }
                            const get_role = this.selected_role.get(`${message.guild?.id}`)
                            if (get_role instanceof Role) {
                                const saved_data = await this.client.prisma.server.update({
                                    where: {
                                        id: BigInt(message.guild?.id as string)
                                    },
                                    data: {
                                        muteRoleId: get_role.id
                                    }
                                }).catch(() => null);
                                if (!saved_data) {
                                    message.channel.send({
                                        embeds: [
                                            {
                                                title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
                                                color: "RED"
                                            }
                                        ],
                                        components: []
                                    })
                                }
                                else {
                                    this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                                    this.selected_channel.delete(`${saved_data.id}`)
                                    await message.delete();
                                    this.messages.delete(`${message.guild?.id as string}`);
                                    await this.exec(get_msg);
                                    return
                                }
                            }
                            else {
                                await message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setTitle('Error')
                                            .setColor('RED')
                                            .setDescription(`You will have to use the command all over again! There seems to be a error with the code`)
                                    ]
                                });
                                this.selected_role.delete(`${message.guild?.id as string}`)
                                this.messages.delete(`${message.guild?.id as string}`)
                                return
                            }
                        })
                    }
                        break;
                    case 'disable': {
                        const get_msg = this.messages.get(`${message.guild?.id}`) as Message
                        await message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription('**Removing the mute role now.**')
                                    .setColor('RED')
                            ],
                            components: []
                        });
                        const saved_data = await this.client.prisma.server.update({
                            where: {
                                id: BigInt(message.guild?.id as string)
                            },
                            data: {
                                muteRoleId: null
                            }
                        })
                        this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
                        this.selected_channel.delete(`${saved_data.id}`)
                        await message.delete();
                        this.messages.delete(`${message.guild?.id as string}`);
                        await this.exec(get_msg);
                    }
                        break;

                }
            }
        })
    }
    // async modr_save(data: guild, interaction: MessageComponentInteraction) {
    //     const button_filter = async (interaction: MessageComponentInteraction) => {
    //         const get_id = this.messages.get(interaction.guild?.id as string)
    //         if (
    //             (interaction.customId === "enable" ||
    //                 interaction.customId === "disable") &&
    //             interaction.user.id !== get_id?.author.id
    //         ) {
    //             await interaction.reply({
    //                 content: `You cant use this. If you are a mod, Please use the command by youself.`,
    //                 ephemeral: true,
    //             });
    //             return false;
    //         }
    //         return true;
    //     };
    //     const message = interaction.message as Message
    //     const modr_save = new MessageEmbed()
    //         .setColor("GREEN")
    //         .setTitle("Mod Roles")
    //         .setDescription(stripIndents(`
    //        Add mod roles which allows users to use permission locked commands
    //         `))
    //     const buttons = new MessageActionRow()
    //         .addComponents([
    //             new MessageButton()
    //                 .setDisabled((data.modRoles?.length || 0) >= 5)
    //                 .setLabel('Add')
    //                 .setStyle('SUCCESS')
    //                 .setCustomId('enable'),
    //             new MessageButton()
    //                 .setDisabled(!data.modRoles?.length)
    //                 .setLabel('Remove')
    //                 .setStyle('DANGER')
    //                 .setCustomId('disable')
    //         ])
    //     await message.edit({
    //         embeds: [modr_save],
    //         components: [buttons]
    //     });
    //     const button_collector = message.createMessageComponentCollector({
    //         filter: button_filter,
    //         time: 1000 * 15,
    //         max: 1
    //     })
    //     button_collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
    //         const decision = collection.first()?.customId;
    //         const message_rev = collection.first()?.message as Message;
    //         if (!decision || !message_rev) {
    //             const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
    //             await message.delete();
    //             this.messages.delete(`${message.guild?.id as string}`);
    //             await this.exec(get_msg);
    //             return
    //         }
    //         else {
    //             switch (decision) {
    //                 case 'enable': {
    //                     const msg_filter = async (coll_message: Message) => {
    //                         const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
    //                         if (coll_message.author.id !== get_msg.author.id) return false;
    //                         const string_roles: string[] = [...coll_message.content.split(', '), ...coll_message.mentions.roles.map<string>(role => role.id)]
    //                         let roles = await Promise.all(string_roles.map(value => {
    //                             try {
    //                                 return coll_message.guild?.roles.fetch(value);
    //                             } catch (_) {
    //                                 return Promise.resolve(undefined);
    //                             }
    //                         }));
    //                         roles = roles.filter(Boolean);
    //
    //                         if ((!roles.length) && coll_message.content !== "exit") {
    //                             await coll_message.reply({
    //                                 embeds: [
    //                                     new MessageEmbed()
    //                                         .setColor('RED')
    //                                         .setDescription(`The roles you specifed is all invalid! Please specify a valid role`)
    //                                 ]
    //                             });
    //                             return false;
    //                         }
    //                         this.selected_role.set(coll_message.guild?.id as string, roles as Role[]);
    //                         return true
    //                     }
    //                     await message.edit({
    //                         embeds: [
    //                             new MessageEmbed()
    //                                 .setDescription('**Adding roles to the modroles**\n\nPlease send a role mentions/id seperated with `, `')
    //                                 .setImage('https://cdn.upload.systems/uploads/I7GdQDBG.png')
    //                                 .setColor('DARK_BLUE')
    //                                 .setFooter(`Type exit to leave the menu`)
    //                         ],
    //                         components: []
    //                     });
    //                     const msg_collector = message.channel.createMessageCollector({
    //                         filter: msg_filter,
    //                         time: 1000 * 60,
    //                         max: 1
    //                     })
    //                     msg_collector.on('end', async (collection: Collection<string, Message>) => {
    //                         const get_msg = this.messages.get(interaction.guild?.id as string) as Message;
    //                         const msg = collection.first()?.content;
    //                         const is_exit: boolean = msg === "exit"
    //                         if (!msg || is_exit) {
    //                             await message.delete();
    //                             this.messages.delete(`${message.guild?.id as string}`);
    //                             await this.exec(get_msg);
    //                             return
    //                         }
    //                         if (!this.selected_channel) throw {
    //                             message: "Code erroring in line 285"
    //                         }
    //                         const get_roles = this.selected_role.get(`${message.guild?.id}`)
    //                         if (get_roles && get_roles instanceof Array) {
    //                             const saved_data = await this.client.prisma.server.update({
    //                                 where: {
    //                                     id: BigInt(message.guild?.id as string)
    //                                 },
    //                                 data: {
    //                                     modRoles: get_roles.map(role => role.id) as string[] || []
    //                                 }
    //                             }).catch(() => null);
    //                             if (!saved_data) {
    //                                 message.channel.send({
    //                                     embeds: [
    //                                         {
    //                                             title: "Error in saving to db! \nPlease try it again\nYou can report this to the devs",
    //                                             color: "RED"
    //                                         }
    //                                     ],
    //                                     components: []
    //                                 })
    //                             }
    //                             else {
    //                                 this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
    //                                 this.selected_channel.delete(`${saved_data.id}`)
    //                                 await message.delete();
    //                                 this.messages.delete(`${message.guild?.id as string}`);
    //                                 await this.exec(get_msg);
    //                                 return
    //                             }
    //                         }
    //                     })
    //                 }
    //                     break;
    //                 case 'disable': {
    //                     const get_msg = this.messages.get(`${message.guild?.id}`) as Message
    //                     await message.edit({
    //                         embeds: [
    //                             new MessageEmbed()
    //                                 .setDescription('**Disabling the Suggest module now.**')
    //                                 .setColor('RED')
    //                         ],
    //                         components: []
    //                     });
    //                     const saved_data = await this.client.prisma.server.update({
    //                         where: {
    //                             id: BigInt(message.guild?.id as string)
    //                         },
    //                         data: {
    //                             suggestChannelId: null
    //                         }
    //                     })
    //                     this.client.cache.data.set(`${saved_data?.id}`, saved_data as guild)
    //                     this.selected_channel.delete(`${saved_data.id}`)
    //                     await message.delete();
    //                     this.messages.delete(`${message.guild?.id as string}`);
    //                     await this.exec(get_msg);
    //                 }
    //                     break;
    //
    //             }
    //         }
    //     })
    // }
}
export default SettingsCommand;
