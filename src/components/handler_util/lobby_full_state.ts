import { createReadyRow } from "./../ready_interaction_row";
import { ButtonInteraction, MessageEmbed, Snowflake } from "discord.js";
import update_embed from "./update_embed";
import { client } from "../../Bot";
import Team from "../../util/teams";
import icon_url from "../../util/icon_url";
import { createReadyEmbed } from "../../embeds/ready_embed";
import remove_player from "./remove_player";
import reserveServer from "./reserveServer";

const messagePlayers = async (
  embed: MessageEmbed,
  interaction: ButtonInteraction
) => {
  console.log("messages players now....");
  const playersInLobby = getIDs(embed.description!);
  playersInLobby.forEach(async (playerID) => {
    if (playerID !== "-1") {
      await (
        await client.users.fetch(playerID)
      ).send({
        embeds: [createReadyEmbed(interaction)],
        components: [createReadyRow()],
      });
    }
  });
};

const addCountdownField = (count: number, preCountdownEmbed: MessageEmbed) => {
  let newField = (count: number) => {
    return {
      name: `Ready up!`,
      value: `All players are in! Time remaining: ${count}`,
      inline: false,
    };
  };
  preCountdownEmbed.fields![2] = newField(count);
  const newEmbedWithAddedField = new MessageEmbed()
    .setDescription(preCountdownEmbed.description!)
    .setFields(preCountdownEmbed.fields!)
    .setFooter(preCountdownEmbed.footer?.text!)
    .setAuthor(preCountdownEmbed.author?.name!, icon_url)
    .setColor("#a85202")
    .setTimestamp(new Date(preCountdownEmbed.timestamp!));

  return newEmbedWithAddedField;
};

export const getIDs = (descstring: string): Snowflake[] => {
  const genericTeam = new Team("BLU");
  return descstring
    .substring(
      descstring.indexOf(genericTeam.getSeparator()) + 1,
      descstring.lastIndexOf(genericTeam.getSeparator())
    )
    .split(",")
    .concat(
      descstring
        .substring(
          descstring.indexOf(genericTeam.getOppositeSeparator()) + 1,
          descstring.lastIndexOf(genericTeam.getOppositeSeparator())
        )
        .split(",")
    );
};

const embedWithRemovedIdlePlayers = async (
  embed: MessageEmbed,
  readyPlayers: Snowflake[]
) => {
  const playersInLobby = getIDs(embed.description!);
  let newEmbed, response;
  for (const ID of playersInLobby) {
    if (!readyPlayers.includes(ID) && ID !== "-1") {
      [response, newEmbed] = await remove_player(embed, ID);
      if (response == "success") {
        embed = newEmbed;
      } else {
        console.log("error removing afk players");
      }
    }
  }
  return embed;
};

export default async (
  interaction: ButtonInteraction,
  preCountdownEmbed: MessageEmbed
) => {
  let readyPlayers: Snowflake[] = [];
  await messagePlayers(preCountdownEmbed, interaction);
  let count = 7; //seconds of countdown
  preCountdownEmbed.fields!.length = 3;
  let counting = true; //make sure this is specified outside of setInterval or it goes sicko mode when the last player quickly joins and leaves, or if the last person to join somehow joins the other team before the countdown starts (should only be possible in testing)

  let countdown = setInterval(async () => {
    console.log(
      `${readyPlayers.length} == ${
        getIDs(interaction.message.embeds[0].description!).length
      }`
    );
    if (
      readyPlayers.length > 0 //== getIDs(interaction.message.embeds[0].description!).length
    ) {
      console.log("all players ready");
      reserveServer(interaction);
      clearInterval(countdown);
    }

    //in an odd order for nice appearance (no extra second for 0 etc e.g 3...2...1...cancel)
    //
    if (count === 0) {
      clearInterval(countdown);
      console.log("now!");
      let newEmbed = await embedWithRemovedIdlePlayers(
        preCountdownEmbed,
        readyPlayers
      );
      update_embed(interaction, newEmbed);
      //now remove players
    } else {
      let newEmbed = addCountdownField(count, preCountdownEmbed);
      update_embed(interaction, newEmbed, true);
      count--;
    }
  }, 1000);

  client.on("interactionCreate", async (newInteraction) => {
    //cancels the countdown if someone in the lobby leaves or if everyone is ready
    if (!newInteraction.isButton()) {
      return;
    }
    const buttonClicked = newInteraction as ButtonInteraction;

    if (
      counting &&
      buttonClicked.customId === "leaveButton" && //
      buttonClicked.message?.embeds[0].description?.includes(
        //description of embed in message connected to the button includes player id
        buttonClicked.user.id
      ) &&
      buttonClicked.message?.id === interaction.message.id //lobby that the last player joined is the lobby someone is leaving from
    ) {
      clearInterval(countdown);
      counting = false;
      console.log("cancelled countdown");
    } else if (
      //ready button is clicked by someone in the lobby while the countdown is counting
      counting &&
      preCountdownEmbed.description!.includes(buttonClicked.user.id) &&
      buttonClicked.channel?.type === "DM" && //possibly redundant
      buttonClicked.customId === "readyButton" &&
      !readyPlayers.includes(buttonClicked.user.id)
    ) {
      readyPlayers.push(buttonClicked.user.id);
      console.log(`${buttonClicked.user.username} is ready`);
    }
  });
};
