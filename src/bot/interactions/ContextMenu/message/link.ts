/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    ContextMenuInteraction, Message
} from "discord.js";
import Menu from "../../../struct/Menu";
import geturls from 'get-urls';

abstract class linksInteraction extends Menu {
    protected constructor() {
        super({
            name: "parse links",
            type: 3
        });
    }

    public async exec(interaction: ContextMenuInteraction) {
        const message = interaction.options.getMessage('message') as Message;
        if (!message || !message.content) {
            await interaction.reply({
                embeds: [
                    {
                        description: "I couldn't find the message content sowwy!"
                    }
                ],
                ephemeral: true
            })
            return
        }
        const strictlinksSet = geturls(message.content, {
            requireSchemeOrWww: true
        })
        const linksSet = geturls(message.content)
        if (!linksSet.size && !strictlinksSet.size) {
            await interaction.reply({
                embeds: [
                    {
                        description: "I coundn't find any links, sowwy!!"
                    }
                ],
                ephemeral: true
            })
            return
        }
        const strictlinks = [...strictlinksSet]
        const links = [...linksSet]

        await interaction.reply({
            embeds: [
                {
                    author: {
                      name: message.author.tag,
                      iconURL: message.author.displayAvatarURL({ dynamic: true })
                    },
                    thumbnail: {
                        url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    fields: [
                        {
                            name: "Normal Links",
                            value: (links.join(' **,** ') || "No Links")
                        },
                        {
                            name: "Strict Links",
                            value: (strictlinks.join(' **,** ') || "No Links")
                        }
                    ],
                    footer: {
                        text: `Service may be incorrect, but that's how it is <> Id: ${message.id}`
                    }
                }
            ],
            ephemeral: true
        })
    }
}

export default linksInteraction;
