import { SlashCommandBuilder } from "discord.js";
import { serverStart } from "../../api/start_server.js";
import { commandsDisabled } from "../functions/disabled_commands.js";

export default {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Starts the server."),
    async execute(interaction) {
        const areCommandsDisabled = commandsDisabled("start");
        if (areCommandsDisabled) {
            interaction.reply(areCommandsDisabled, { ephemeral: true });
            return;
        }
        await interaction.reply(await serverStart());
    },
};
