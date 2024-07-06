import { config } from "../../config.js";

export function commandsDisabled(command) {
    if (!config.commands.slash.enabled) {
        let disabledResponse;

        if (!config.commands.text.enabled) { // Idiot proofing
            disabledResponse = "Commands are disabled! :sob: \nTry setting one of the command values to `true` in `config.json` to enable commands.";
            return;
        } 

        disabledResponse = `Slash commands are disabled.\nTry \`${config.commands.text.prefix}${command}\` instead`
        return disabledResponse;
    }
}
