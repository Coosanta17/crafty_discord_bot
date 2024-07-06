import { config } from "../../config.js";

export function commandsDisabled(command) {
    if (!config.slash.enabled) {
        let disabledResponse;

        if (!config.text.enabled) { // Idiot proofing
            disabledResponse = "Commands are disabled! :sob: \nTry setting one of the command values to `true` in `config.json` to enable commands.";
            return;
        } 

        disabledResponse = `Slash commands are disabled.\nTry \`${config.text.prefix}${command}\` instead`
        return disabledResponse;
    }
}
