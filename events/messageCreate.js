import fs from "fs";
const dataPath = "./data/guilds.json";

export default {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const guildsConfig = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        const prefix = guildsConfig[message.guild.id]?.prefix || client.config.defaultPrefix;

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const command = client.commands.get(cmdName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (err) {
            console.error(err);
        }
    }
};
