import { SlashCommandBuilder } from "discord.js";
import { help } from "../functions/help_response.js";
import { handleCommand } from "../command_handler.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the available commands."),
    async execute(interaction) {
        await handleCommand(interaction, "help", async (interaction) => {
            await interaction.reply(help("/"));
        });
    },
};
