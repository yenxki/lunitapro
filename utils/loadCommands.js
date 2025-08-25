const fs = require('fs');

function loadCommands(client) {
    const commandDirs = fs.readdirSync('./commands');
    for (const dir of commandDirs) {
        const files = fs.readdirSync(`./commands/${dir}`).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.name) {
                command.category = dir;
                client.commands.set(command.name, command);
                if (command.aliases) {
                    command.aliases.forEach(alias => client.aliases.set(alias, command.name));
                }
                client.categories.add(dir);
            }
        }
    }
}
module.exports = { loadCommands };
