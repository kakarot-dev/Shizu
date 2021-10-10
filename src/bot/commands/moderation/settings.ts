/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
    Guild,
    Message,
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu,
    MessageComponentInteraction,
    Collection, MessageButton
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
    MUTER = "muteRoleId"
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
            userPermissions: ["MANAGE_GUILD"],
            clientPermissions: [],
        });
    }

    public async exec(message: Message): Promise<void> {
        await this.init(message);
    }
    async init(message: Message): Promise<Message> {
        const filter = async (interaction: MessageComponentInteraction) => {
            const value: string = interaction.customId.toUpperCase()
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
        collector.on('end', async (collection: Collection<string, MessageComponentInteraction>) => {
            const interaction: string | undefined = collection.first()?.customId
            console.log(interaction)
            if (!interaction)
                await message_1.edit({
                    embeds: [this.create_embed_1(data as guild, message.guild as Guild, true)],
                    components: [this.create_select_menus_1(true)]
                })
            else {
                const to_save = module_names[interaction.toUpperCase()] as string;
                console.log(to_save)
                if (to_save === "waifu") await this.waifu_save(data as guild, message_1)
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
                        name: "Waifu",
                        value: stripIndents(`
                    ${data.waifu ? `${emojis.yea} <#${data.waifu}>` : `${emojis.wrong} ~~Enabled~~`}
                    `),
                        inline: true
                    },
                    {
                        name: "Code to Image",
                        value: stripIndents(`
                    ${data.ioc ? `${emojis.yea} Enabled` : `${emojis.wrong} ~~Enabled~~`}
                    `),
                        inline: true
                    },
                    {
                        name: "Discord Status",
                        value: stripIndents(`
                    ${data.statusChannelId ? `${emojis.yea} <#${data.statusChannelId}>` : `${emojis.wrong} ~~Enabled~~`}
                    `),
                        inline: true
                    },
                    {
                        name: "Mod Logs",
                        value: stripIndents(`
                        ${data.modLogsChannelId ? `${emojis.yea} <#${data.modLogsChannelId}>` : `${emojis.wrong} ~~Enabled~~`}
                        `),
                        inline: true
                    },
                    {
                        name: "Suggestions",
                        value: stripIndents(`
                        ${data.suggestChannelId ? `${emojis.yea} <#${data.suggestChannelId}>` : `${emojis.wrong} ~~Enabled~~`}
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
                       ${data.muteRoleId ? `${emojis.yea} <@&${data.muteRoleId}>` : `${emojis.wrong} ~~Enabled~~`}
                        `),
                        inline: true
                    },
                    {
                        name: "Mod Roles",
                        value: stripIndents(`
                       ${data.modRoles?.length ? `${data.modRoles.map<string>(id => `<@&${id}>`).join(' ')}` : `${emojis.wrong} ~~Enabled~~`}
                        `),
                        inline: (data.modRoles?.length || 0) < 1
                    }
                ])
                .setColor(end ? "RED" : "GREEN")
            return embed_1
    }
    create_select_menus_1(end: boolean): MessageActionRow {
            const select_menus_1 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setDisabled(end)
                        .setCustomId('waifu')
                        .setPlaceholder(end ? 'Use the command again' : 'Select a option to edit')
                        .setMaxValues(1)
                        .setMinValues(1)
                        .addOptions([
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
                            {
                                label: "Mod Roles",
                                description: "Add roles to use mod commands",
                                value: "modr",
                                emoji: emojis.settings.mod
                            }
                        ])
                )
            return select_menus_1
    }
    async waifu_save(data: guild, message: Message) {
        const filter = async (interaction: MessageComponentInteraction) => {
            if (!) {
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
            filter
        })
    }
}
export default SettingsCommand;
