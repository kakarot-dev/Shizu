/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import { sync } from "glob";
import { resolve } from "path";
import Bot from "../../api/Client";
import Menu from "../../struct/Menu";

const registerButtons: Function = (client: Bot) => {
    const interactionFiles = sync(resolve("dist/bot/interactions/ContextMenu/**/*"));
    interactionFiles.forEach(async (file) => {
        if (/\.js$/iu.test(file)) {
            const File = require(file).default;
            if (File && File.prototype instanceof Menu) {
                const menu: Menu = new File();
                menu.client = client;
                client.menus.set(menu.name, menu);
            }
        }
    });
};

export default registerButtons;
