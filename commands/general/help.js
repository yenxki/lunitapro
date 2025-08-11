const { EmbedBuilder } = require("discord.js");
const prefixManager = require("../../utils/prefixManager");
const config = require("../../config.json");

module.exports = {
    name: "help",
    aliases: ["ayuda", "comandos"],
    run: (client, message) => {
        const prefix = prefixManager.getPrefix(message.guild.id) || config.defaultPrefix;

        const categories = {};

        client.commands.forEach(cmd => {
            const category = cmd.category || "Otros";
            if (!categories[category]) categories[category] = [];
            categories[category].push(`\`${prefix}${cmd.name}\` - ${cmd.description || "Sin descripción"}`);
        });

        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("📜 Lista de comandos de Lunita")
            .setFooter({ text: "Usa los comandos con el prefijo configurado" });

        for (const [category, cmds] of Object.entries(categories)) {
            embed.addFields({ name: `📂 ${category}`, value: cmds.join("\n") });
        }

        message.channel.send({ embeds: [embed] });
    }
};
