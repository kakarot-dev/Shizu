/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import Bot from "../../api/Client";
import Command from "../../struct/Command";
import { sync } from "glob";
import { resolve } from "path";

// tslint:disable-next-line: ban-types
const registerCommands: Function = (client: Bot) => {
  const commandFiles = sync(resolve("dist/bot/commands/**/*"));
  commandFiles.forEach((file) => {
    if (/\.js$/iu.test(file)) {
      const File = require(file).default;
      if (File && File.prototype instanceof Command) {
        // tslint:disable-next-line: new-parens
        const command: Command = new File();
        command.client = client;
        client.commands.set(command.name, command);
        command.aliases.forEach((alias) => client.commands.set(alias, command));
      }
    }
  });
};

export default registerCommands;
