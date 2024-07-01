import { SlashCommandBuilder } from "discord.js";
import { serverStart } from "../api/start_server.js";

export default {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Starts the server."),
  async execute(interaction) {
    await interaction.reply(await serverStart());
  },
};
