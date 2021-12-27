import { ButtonInteraction, MessageEmbed, Snowflake, User } from "discord.js";
import update_embed from "./update_embed";
import lobby_is_full from "./lobby_is_full";
import Team from "../../util/teams";
import empty_slot_string from "../../util/empty_slot_string";
import lobby_full_state from "./lobby_full_state";
import icon_url from "../../util/icon_url";

const add_player_id_and_name = (
  newPlayer: User,
  playerIDs: Snowflake[],
  desc: string,
  playerNames: string[]
): "switch" | "playing" | "full" | [Snowflake[], string] => {
  if (desc.includes(newPlayer.id)) {
    if (!playerIDs.includes(newPlayer.id)) {
      return "switch";
    } else {
      return "playing";
    }
  }
  for (const [idx, id] of playerIDs.entries()) {
    if (id === "-1") {
      playerIDs[idx] = newPlayer.id;
      playerNames[idx] = playerNames[idx].replace(
        empty_slot_string,
        newPlayer.username
      );
      return [playerIDs, playerNames.join("\n")];
    }
  }
  return "full";
};

const add_player_name = (
  newPlayerName: string,
  playerNames: string[]
): string[] => {
  for (const [idx, name] of playerNames.entries()) {
    if (name === empty_slot_string) {
      playerNames[idx] = playerNames[idx].replace(
        empty_slot_string,
        newPlayerName
      );
      return playerNames;
    }
  }
  return playerNames;
};

export default (
  interaction: ButtonInteraction,
  team: Team,
  premadeEmbed?: MessageEmbed
): "success" | "switch" | "full" | "playing" => {
  let oldEmbed;
  if (!premadeEmbed) {
    oldEmbed = interaction.message.embeds[0];
  } else {
    oldEmbed = premadeEmbed;
  }

  const separator = team.getSeparator();
  const teamIndex = team.getIndex();
  let response: "success" | "switch" | "full" | "playing" = `success`;
  const desc = oldEmbed.description!; //uses description to hide player IDs that are currently in the game in an invisible hyperlink
  const playerIDsString = desc.substring(
    desc.indexOf(separator) + 1,
    desc.lastIndexOf(separator)
  );
  const playerIDs = playerIDsString.split(",");
  const playerIDsWithAddedPlayerAndAddedPlayerString = add_player_id_and_name(
    //can't use list [a,b] = func() syntax because it doesn't always return 2 things, among other reasons, maybe come clean this up in the future
    interaction.user,
    playerIDs,
    desc,
    oldEmbed.fields![teamIndex].value.split("\n")
  );
  if (typeof playerIDsWithAddedPlayerAndAddedPlayerString === "string") {
    //what a monstrosity
    response = playerIDsWithAddedPlayerAndAddedPlayerString;
  } else {
    const [playerIDsWithAddedPlayer, addedPlayerNamesString] =
      playerIDsWithAddedPlayerAndAddedPlayerString;
    const addedPlayerIDsString = playerIDsWithAddedPlayer.join(",");
    const newDesc = desc.replace(
      `${separator}${playerIDsString}${separator}`,
      `${separator}${addedPlayerIDsString}${separator}`
    );

    const newField = {
      name: team.name,
      value: addedPlayerNamesString,
      inline: true,
    };
    oldEmbed.fields?.splice(teamIndex, 1, newField)!;

    const newEmbed = new MessageEmbed()
      .setDescription(newDesc)
      .setFields(oldEmbed.fields!)
      .setFooter(oldEmbed.footer?.text!)
      .setAuthor(oldEmbed.author?.name!, icon_url)
      .setColor("#a85202")
      .setTimestamp(new Date(oldEmbed.timestamp!));

    update_embed(interaction, newEmbed);

    if (
      lobby_is_full(
        playerIDsWithAddedPlayer, //these are both of the player ID arrays of Snowflakes (both teams)
        desc
          .substring(
            desc.indexOf(team.getOppositeSeparator()) + 1,
            desc.lastIndexOf(team.getOppositeSeparator())
          )
          .split(",")
      )
    ) {
      lobby_full_state(interaction, newEmbed);
    }
  }
  return response;
};
