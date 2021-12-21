import { ButtonInteraction, MessageEmbed } from "discord.js";
import icon_url from "../util/icon_url";
export const createConnectEmbed = (connectString: string) => {
  const connect_embed = new MessageEmbed()
    .setColor("#03fc0f")
    .setAuthor(
      "Server is ready! Paste the following into the console to join",
      icon_url
    )
    .setDescription(connectString)
    .setTimestamp();
  return connect_embed;
};
