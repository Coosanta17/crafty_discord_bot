import { EmbedBuilder } from "discord.js";

export function help(prefix) {
    const helpEmbed = new EmbedBuilder()
        .setColor(0x969696)
        .setTitle('Help')
        .setDescription('Available commands:')
        .addFields(
            { name: 'START', value: `*Starts the server.*\nUsage: \`${prefix}start\`` },
            { name: 'HELP', value: `*Shows the available commands.*\nUsage: \`${prefix}help\`` },
            { name: "That's all for now.", value: '*New features will be added soon!*' }
        )
        // .setTimestamp();

    return {embeds: [helpEmbed]};
}
