/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import { sync } from "glob";
import { resolve } from "path";
import Bot from "../../api/Client";
import Button from "../../struct/Button";

const registerButtons: Function = (client: Bot) => {
  const interactionFiles = sync(resolve("dist/bot/interactions/Buttons/**/*"));
  interactionFiles.forEach(async (file) => {
    if (/\.js$/iu.test(file)) {
      const File = require(file).default;

      if (File && File.prototype instanceof Button) {
        const button: Button = new File();
        button.path = file;
        button.client = client;
        client.buttons.set(button.name, button);
      }
    }
  });
};

export default registerButtons;
