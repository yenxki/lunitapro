import fs from "fs";
const dataPath = "./data/guilds.json";

export default {
    name: "setprefix",
    description: "Cambia el prefijo del bot en este servidor.",
    async execute(message, args, client) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ No tienes permisos para usar este comando.");
        }

        const newPrefix = args[0];
        if (!newPrefix) return message.reply("❌ Debes indicar el nuevo prefijo.");

        const guildsConfig = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        if (!guildsConfig[message.guild.id]) guildsConfig[message.guild.id] = {};
        guildsConfig[message.guild.id].prefix = newPrefix;

        fs.writeFileSync(dataPath, JSON.stringify(guildsConfig, null, 2));

        message.reply(`✅ Prefijo cambiado a **${newPrefix}**`);
    }
};
