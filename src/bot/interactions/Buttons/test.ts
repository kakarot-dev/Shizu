/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import Button from "../../struct/Button";

abstract class testInteraction extends Button {
  constructor() {
    super({
      name: "test",
    });
  }

  public async exec(interaction: ButtonInteraction) {
    (interaction.message as Message).edit({
      content: "Testing without errors",
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("hello")
            .setLabel("Yes, Do it")
            .setStyle("SUCCESS"),
        ]),
      ],
    });
  }
}

export default testInteraction;
