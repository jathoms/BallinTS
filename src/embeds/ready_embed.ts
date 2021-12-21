import { ButtonInteraction, MessageEmbed } from "discord.js";
import icon_url from "../util/icon_url";
export const createReadyEmbed = (interaction: ButtonInteraction) => {
  const ready_embed = new MessageEmbed()
    .setColor("#03fc0b")
    .setAuthor("All players have joined!", icon_url)
    .setDescription(
      `[\u200b](|${interaction.message.id}|)Click the ready button to ready up!\nIf you're not ready, then... don't?`
    )
    .setTimestamp();
  return ready_embed;
};
