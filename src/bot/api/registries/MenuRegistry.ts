/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import { sync } from "glob";
import { resolve } from "path";
import Bot from "../../api/Client";
import Menu from "../../struct/Menu";
// import { ApplicationCommandData } from 'discord.js'

const registerButtons: Function = (client: Bot) => {
    const interactionFiles = sync(resolve("dist/bot/interactions/ContextMenu/**/*"));
    interactionFiles.forEach(async (file) => {
        if (/\.js$/iu.test(file)) {
            const File = require(file).default;
            if (File && File.prototype instanceof Menu) {
                const menu: Menu = new File();
                menu.client = client;
                client.menus.set(menu.name, menu);
                // const data: ApplicationCommandData = {
                //   name: menu.name,
                //   type: menu.type
                // };
                //await client.guilds.cache.get('740545693118234664')?.commands.create(data)
                //await client.guilds.cache.get('823797050801913886')?.commands.create(data);
                //await client.guilds.cache.get('851088432859447347')?.commands.create(data);
                //await client.guilds.cache.get('789800070895763476')?.commands.create(data); // Guild commands
                // await client.guilds.cache.get('789800070895763476')?.commands.set([]); // Remove all guild commands
                // await client.application?.commands.create(data); // Global commands
                // await client.application?.commands.set([]); // Remove all guild commands
            }
        }
    });
};

export default registerButtons;
