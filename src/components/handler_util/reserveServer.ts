import { createConnectEmbed } from "../../embeds/connect_embed";
import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });
const apiKey = process.env.SERVEME;
import axios from "axios";
import { ButtonInteraction, MessageEmbed } from "discord.js";
import update_embed from "./update_embed";
import { getIDs } from "./lobby_full_state";
import { client } from "../../Bot";
import icon_url from "../../util/icon_url";

const embedWithReservingMessage = (embed: MessageEmbed) => {
  embed.fields![2] = {
    name: "All players ready!",
    value: "Reserving server...",
    inline: false,
  };

  const newEmbedWithAddedField = new MessageEmbed()
    .setDescription("AWDASDAWD")
    .setFields(embed.fields!)
    .setFooter(embed.footer?.text!)
    .setAuthor(embed.author?.name!, icon_url)
    .setColor("#a85202")
    .setTimestamp(new Date(embed.timestamp!));

  return newEmbedWithAddedField;
};

const genPassword = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const messagePlayersConnectString = async (
  embed: MessageEmbed,
  connectString: string
) => {
  const playersInLobby = getIDs(embed.description!);

  playersInLobby.forEach(async (playerID) => {
    if (playerID !== "-1") {
      await (
        await client.users.fetch(playerID)
      ).send({
        embeds: [createConnectEmbed(connectString)],
      });
    }
  });
};

export default async (interaction: ButtonInteraction) => {
  const embed = interaction.message.embeds[0] as MessageEmbed;
  let newEmbed = embedWithReservingMessage(embed);
  console.log(
    `updating with new third field: ${newEmbed.fields[2].name}, ${newEmbed.fields[2].value}`
  );
  update_embed(interaction, newEmbed, true);
  const map = embed.author!.name!.substring(
    embed.author!.name!.lastIndexOf(" ") + 1
  );
  const chosenConfig = embed.footer?.text?.substr(
    embed.footer.text!.lastIndexOf(" ") + 1
  );
  console.log(`map=${map}\nconfig=${chosenConfig}`);
  const available = (
    await axios.get(`https://serveme.tf/api/reservations/new?api_key=${apiKey}`)
  ).data;
  const [reservation, findServers] = [
    available.reservation,
    available.actions.find_servers,
  ];
  const servers = (
    await axios.post(`${findServers}?api_key=${apiKey}`, reservation)
  ).data;
  const availableConfigs: any[] = servers.server_configs;
  let resForm = servers.reservation;
  resForm.first_map = map;
  resForm.server_config = availableConfigs.filter(
    (config) => config.file === chosenConfig
  )[0].id;

  const serverChoice = servers.servers;
  resForm.server_id = serverChoice[0].id;

  const password = genPassword(8);
  const rconPass = genPassword(8);
  console.log(
    `Server starting on ${map} with:\npw:${password}\nrcon:${rconPass}`
  );

  resForm.password = password;
  resForm.rcon = rconPass;
  resForm.auto_end = true;
  console.log("here");
  const confirm = (
    await axios.post(`${servers.actions.create}?api_key=${apiKey}`, resForm)
  ).data;
  console.log("here2");
  messagePlayersConnectString(
    embed,
    `${confirm.reservation.server.ip_and_port}/${password}`
  );
};
