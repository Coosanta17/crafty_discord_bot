import { SlashCommandBuilder } from "discord.js";
import { serverStart } from "../../api/start_server.js";
import { handleCommand } from "../command_handler.js";

export default {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Starts the server."),
    async execute(interaction) {
        await handleCommand(interaction, "start", async (interaction) => {
            await interaction.reply(await serverStart());
        });
    },
};
