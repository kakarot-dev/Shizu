/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    ContextMenuInteraction, Message
} from "discord.js";
import Menu from "../../../struct/Menu";
import translate from '@iamtraction/google-translate';

abstract class translateInteraction extends Menu {
    protected constructor() {
        super({
            name: "translate",
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
                ]
            })
            return
        }
        const translation = await translate(message.content, {
            to: 'en'
        }).catch(() => null)
        if (!translation || !translation.text) {
            await interaction.reply({
                embeds: [
                    {
                        description: "I couldnt translate this text, sowwy!"
                    }
                ]
            })
            return
        }

        await interaction.reply({
            embeds: [
                {
                    title: `Translation from en to ${translation.from.language.iso}`,
                    description: `${translation.text}`,
                    color: 13464391,
                    footer: {
                        text: `Translation by @iamtraction/google-translate <> Id: ${message.id}`
                    }
                }
            ]
        })
    }
}

export default translateInteraction;
