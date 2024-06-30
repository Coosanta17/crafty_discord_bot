import { SlashCommandBuilder } from "discord.js";

export const start = new SlashCommandBuilder()
.setName('start')
.setDescription('Starts the server.');