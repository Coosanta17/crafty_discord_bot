import { SlashCommandBuilder } from "discord.js";
import { help } from "../functions/help_reponse.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the available commands."),
    async execute(interaction) {
        await interaction.reply(help("/"));
    },
}