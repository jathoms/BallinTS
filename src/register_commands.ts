import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });
import fs from "fs";

const commands = [];
const commandFiles = fs
  .readdirSync(`${__dirname}/commands`)
  .filter((file: any) => file.endsWith(".js"));

// Place your client and guild ids here
const clientId = process.env.BOT_ID!;
const guildId = process.env.GUILD_ID!;

for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
