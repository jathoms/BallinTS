import { Client, Intents, Collection } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });

export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = new Collection<unknown, any>();
const componentHandlers = new Collection<unknown, any>();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file: string) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  commands.set(command.data.name, command);
}

const componentHandlerFiles = fs
  .readdirSync("./components/subcomponents")
  .filter((file: string) => file.endsWith(".js"));

for (const file of componentHandlerFiles) {
  const handler = require(`./components/subcomponents/${file}`);
  componentHandlers.set(handler.data.name, handler);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!commands.has(commandName)) return;
  try {
    // log each interaction with timestamp, user, command and arguments
    let timestamp = new Date(Date.now());
    console.log(
      `\n${timestamp.toLocaleString("en-GB", { timeZone: "UTC" })}\n${
        interaction.user
      } (${interaction.user.username}): /${interaction.commandName}`
    );
    for (const option of interaction.options.data) {
      console.log(`${option.name}: ${option.value}`);
    }
    //execute
    await commands.get(commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;
  try {
    // log each interaction with timestamp, user and component
    let timestamp = new Date(Date.now());
    console.log(
      `\n${timestamp.toLocaleString("en-GB", { timeZone: "UTC" })}\n${
        interaction.user
      } (${interaction.user.username}) clicked: ${
        interaction.customId
      }\n on message ${interaction.message.id}`
    );
    //execute
    await componentHandlers.get(customId).execute(interaction, customId);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this button!",
      ephemeral: true,
    });
  }
});

client.once("ready", async () => {
  console.log("Ready!");
});

client.login(process.env.TOKEN);
