import { MessageEmbed, Snowflake, User } from "discord.js";
import empty_slot_string from "../util/empty_slot_string";
import icon_url from "../util/icon_url";

const initialPlayerString = (teamSize: number) => {
  return Array<string>(teamSize).fill(`${empty_slot_string}`).join("\n");
};

const initialPlayerIDs = (teamSize: number) => {
  return Array<Snowflake>(teamSize).fill("-1");
};

export const createInitialStartEmbed = (
  user: User,
  formatName: string,
  region: string,
  map: string,
  teamSize: number,
  configName: string
) => {
  const startEmbed = new MessageEmbed()
    .setColor("#a85202")
    .setDescription(
      //hides the player IDs for the list of names in an invisible hyperlink in the description of the embed. i know, genius right?
      `[\u200b](|${initialPlayerIDs(teamSize)}|£${initialPlayerIDs(
        teamSize
      )}£)Click a team's button to join that team\nFirst ${teamSize} confirmed players for each team will be sent server details`
    )
    .setAuthor(
      `${formatName} check started in ${region} by ${user.username} on ${map}`,
      icon_url
    )
    .addFields(
      { name: "BLU", value: initialPlayerString(teamSize), inline: true },
      { name: "RED", value: initialPlayerString(teamSize), inline: true }
    )
    .setFooter(`Config: ${configName}`)
    .setTimestamp();
  return startEmbed;
};
