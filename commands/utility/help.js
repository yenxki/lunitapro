module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Muestra el menú interactivo de comandos",
    usage: "help",
    category: "Utility",
    run: async (client, message, args, prefix) => {
        const { executeHelp } = require("../../handlers/helpHandler");
        executeHelp(message, client, prefix);
    }
};
