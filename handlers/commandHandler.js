const fs = require("fs");

module.exports = (client) => {
    for (const category of fs.readdirSync("./commands/")) {
        const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith(".js"));
        for (const file of commands) {
            const command = require(`../commands/${category}/${file}`);
            if (!command.name) continue; // Evitar comandos mal formateados
            command.category = category;
            client.commands.set(command.name, command);
            if (command.aliases && command.aliases.length) {
                command.aliases.forEach(alias => client.aliases.set(alias, command.name));
            }
        }
    }
};
