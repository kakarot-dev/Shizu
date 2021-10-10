/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from '../../struct/Command';
import { Message } from 'discord.js';

abstract class ReloadCommand extends Command {
    protected constructor() {
        super({
            name: 'reload',
            aliases: ['rld'],
            description: 'reload files from cache',
            usage: '<prefix>reload',
            category: 'Devs',
            cooldown: 2,
            ownerOnly: true,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: []
        });
    }

    public async exec(message: Message, args: string[]) {
        switch (args[0]) {
            case undefined: {
                await message.reply({
                    content: `Specify a arg between "commands", "events", "menus", "buttons", "slash"`
                })
            }
            break;
            case "commands": {
                const command = this.client.commands.get(args[1]);
                if (!command) {
                    await message.reply({
                        content: `Couldn't find a command named ${args[1] || undefined}`
                    })
                    return
                }
                delete require.cache[require.resolve(command.path as string)];
                this.client.commands.delete(command.name);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                let newCommand =  require(command.path as string).default;
                newCommand = new newCommand()
                newCommand.client = this.client
                newCommand.path = command.path
                this.client.commands.set(newCommand.name, newCommand)
                await message.channel.send({
                    embeds: [
                        {
                            "description": `${newCommand.name} is reloaded now`,
                            "color": "GREEN"
                        }
                    ]
                })
            }
            break;
            case "events": {
                const event = this.client.events.get(args[1]);
                if (!event) {
                    await message.reply({
                        content: `Couldn't find a event named ${args[1] || undefined}`
                    })
                    return
                }
                delete require.cache[require.resolve(event.path as string)];
                this.client.commands.delete(args[1]);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                let newEvent = require(event.path as string).default;
                newEvent = new newEvent()
                newEvent.client = this.client
                newEvent.path = event.path
                this.client.events.set(newEvent.name, newEvent)
                await message.channel.send({
                    embeds: [
                        {
                            "description": `${newEvent.name} is reloaded now`,
                            "color": "GREEN"
                        }
                    ]
                })
            }
            break;
            case "interactions": {
                const interaction = this.client.interactions.get(args[1]);
                if (!interaction) {
                    await message.reply({
                        content: `Couldn't find a interaction named ${args[1] || undefined}`
                    })
                    return
                }
                delete require.cache[require.resolve(interaction.path as string)];
                this.client.interactions.delete(args[1]);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                let newInteraction =  require(interaction.path as string).default;
                newInteraction = new newInteraction()
                newInteraction.client = this.client
                newInteraction.path = interaction.path
                this.client.interactions.set(newInteraction.name, newInteraction)
                await message.channel.send({
                    embeds: [
                        {
                            "description": `${newInteraction.name} is reloaded now`,
                            "color": "GREEN"
                        }
                    ]
                })
            }
            break;
            case "menus": {
                const menu = this.client.menus.get(args[1]+ " " + args[2]);
                if (!menu) {
                    await message.reply({
                        content: `Couldn't find a menu named ${args[1] + " " + args[2] || undefined}`
                    })
                    return
                }
                delete require.cache[require.resolve(menu.path as string)];
                this.client.menus.delete(args.join(' '));
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                let newMenu =  require(menu.path as string).default;
                newMenu = new newMenu()
                newMenu.client = this.client
                newMenu.path = menu.path
                this.client.menus.set(newMenu.name, newMenu)
                await message.channel.send({
                    embeds: [
                        {
                            "description": `${newMenu.name} is reloaded now`,
                            "color": "GREEN"
                        }
                    ]
                })
            }
            break;
            case "buttons": {
                const button = this.client.buttons.get(args[1]);
                if (!button) {
                    await message.reply({
                        content: `Couldn't find a button named ${args[1] || undefined}`
                    })
                    return
                }
                delete require.cache[require.resolve(button.path as string)];
                this.client.buttons.delete(args[1]);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                let newButton =  require(button.path as string).default;
                newButton = new newButton()
                newButton.client = this.client
                newButton.path = button.path
                this.client.buttons.set(newButton.name, newButton)
                await message.channel.send({
                    embeds: [
                        {
                            "description": `${newButton.name} is reloaded now`,
                            "color": "GREEN"
                        }
                    ]
                })
            }
            break;
        }
    }
}
export default ReloadCommand;

