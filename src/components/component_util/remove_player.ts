import { APIEmbed } from "discord-api-types";
import { ButtonInteraction, MessageEmbed, Snowflake } from "discord.js";
import empty_slot_string from "../../util/empty_slot_string";
import Team from "../../util/teams";
import { client } from "../../Bot";
import icon_url from "../../util/icon_url";

const get_team_of_user = (
  BLU_IDs: string,
  RED_IDs: string,
  playerID: Snowflake
): Team | "error" => {
  if (BLU_IDs.includes(playerID)) {
    return new Team("BLU");
  } else if (RED_IDs.includes(playerID)) {
    return new Team("RED");
  } else return "error";
};

const remove_player_name_and_id = async (
  playerIDToRemove: Snowflake,
  playerNames: string[],
  playerIDs: Snowflake[]
): Promise<string[]> => {
  for (const [idx, id] of playerIDs.entries()) {
    if (id === playerIDToRemove) {
      playerNames[idx] = playerNames[idx].replace(
        (await client.users.fetch(id)).username,
        empty_slot_string
      );
      playerIDs[idx] = "-1";
    }
  }
  return playerNames;
};

const get_id_strings = (embedDescription: string): [string, string] => {
  const genericTeam = new Team("BLU");
  let separator = genericTeam.getSeparator();
  const otherSeparator = genericTeam.otherTeam().getSeparator();

  const BLUPlayerIDsString = embedDescription.substring(
    embedDescription.indexOf(separator) + 1,
    embedDescription.lastIndexOf(separator)
  );
  const REDPlayerIDsString = embedDescription.substring(
    embedDescription.indexOf(otherSeparator) + 1,
    embedDescription.lastIndexOf(otherSeparator)
  );
  return [BLUPlayerIDsString, REDPlayerIDsString];
};

export default async (
  //this function does not update the embed, it only returns what an updated embed would look like if the removal is successful, else it returns the same embed and and the reason why the removal wasn't successful
  interactionEmbed: MessageEmbed,
  userID: Snowflake
): Promise<["success" | "fail" | "absent", MessageEmbed]> => {
  const desc = interactionEmbed.description!; //uses description to hide player IDs that are currently in the game in an invisible hyperlink

  if (!desc.includes(userID)) {
    return ["absent", interactionEmbed];
  }
  let response: "success" | "fail" = `success`;

  const [BLUPlayerIDsString, REDPlayerIDsString] = get_id_strings(desc);

  const team = get_team_of_user(BLUPlayerIDsString, REDPlayerIDsString, userID);
  if (typeof team === "string") {
    return ["fail", interactionEmbed];
  }
  const teamIndex = team.getIndex();
  const separator = team.getSeparator();
  const stringOfUserTeam =
    team.name === "BLU" ? BLUPlayerIDsString : REDPlayerIDsString;

  const oldEmbed = interactionEmbed;
  let playerIDsOfUserTeam = stringOfUserTeam.split(",");

  const removedPlayerString =
    //imperatively alters playerIDsOfUserTeam as well as change the string of names
    (await remove_player_name_and_id(
      userID,
      oldEmbed.fields![teamIndex].value.split("\n"),
      playerIDsOfUserTeam
    ))!.join("\n");

  const newDesc = desc.replace(
    `${separator}${stringOfUserTeam}${separator}`,
    `${separator}${playerIDsOfUserTeam}${separator}`
  );

  const newField = {
    name: team.name,
    value: removedPlayerString,
    inline: true,
  };
  oldEmbed.fields!.splice(teamIndex, 1, newField)!;
  oldEmbed.fields!.length = 2; //If there is a countdown going on (3rd field), that field will be removed if somebody leaves during the ready up countdown period (or generally)
  const newEmbed = new MessageEmbed()
    .setDescription(newDesc)
    .setFields(oldEmbed.fields!)
    .setFooter(oldEmbed.footer?.text!)
    .setAuthor(oldEmbed.author?.name!, icon_url)
    .setColor("#a85202")
    .setTimestamp(new Date(oldEmbed.timestamp!));

  //this is instead of updating twice for a player to join the team opposite the one they are currently on, (remove->add->update) instead of (remove->update->add->update)
  //also applicable for removing inactive players after the ready up period times out, (remove->remove->...->update) instead of (remove->update->remove->update->...->update), you get it.
  return [response, newEmbed];
};
