import { SlashCommandBuilder } from "discord.js";
import { help } from "../functions/help_reponse.js";
import { commandsDisabled } from "../functions/disabled_commands.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the available commands."),
    async execute(interaction) {
        let areCommandsDisabled = commandsDisabled("help");
        if (areCommandsDisabled) {
            await interaction.reply(areCommandsDisabled, { ephemeral: true });
            return;
        }

        await interaction.reply(help("/"));
    },
}