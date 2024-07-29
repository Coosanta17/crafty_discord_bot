import { SlashCommandBuilder } from "discord.js";
import { serverStop } from "../../api/stop_server.js";
import { handleCommand } from "../command_handler.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the server."),
    async execute(interaction) {
        await handleCommand(interaction, "stop", async (interaction) => {
            await interaction.reply(await serverStop());
        });
    },
};
