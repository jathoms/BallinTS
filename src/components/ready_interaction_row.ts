import { MessageActionRow, MessageButton } from "discord.js";
const createReadyButton = () => {
  const button = new MessageButton()
    .setCustomId(`readyButton`)
    .setLabel("Ready!")
    .setStyle("PRIMARY");
  return button;
};

export const createReadyRow = () => {
  const row = new MessageActionRow().addComponents([createReadyButton()]);
  return row;
};
