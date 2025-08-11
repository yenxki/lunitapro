const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const economyPath = path.join(__dirname, "../../database/economy.json");
const economyManager = require("../../utils/economyManager");

module.exports = {
    name: "top",
    aliases: ["lb", "leaderboard", "ranking"],
    category: "Economía",
    description: "Muestra el ranking de los usuarios más ricos",
    run: (client, message) => {
        const data = JSON.parse(fs.readFileSync(economyPath, "utf8"));
        if (!data[message.guild.id]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ No hay datos")
                        .setDescription("Aún no hay registros de economía en este servidor.")
                ]
            });
        }

        const sorted = Object.entries(data[message.guild.id])
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        const description = sorted
            .map(([userId, balance], index) => {
                const user = message.guild.members.cache.get(userId)?.user;
                return `**${index + 1}.** ${user ? user.username : "Usuario desconocido"} — **${economyManager.formatBalance(balance)}**`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🏆 Ranking de Lunita")
            .setDescription(description || "No hay datos disponibles.");

        message.channel.send({ embeds: [embed] });
    }
};
