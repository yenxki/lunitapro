const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "Muestra los usuarios con más dinero",
    usage: "leaderboard",
    category: "Economy",
    run: async (client, message) => {
        const guildId = message.guild.id;
        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription("No hay datos de economía en este servidor.")] });

        const leaderboard = Object.entries(eco[guildId])
            .map(([userId, data]) => ({ userId, total: data.wallet + data.bank }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        const embed = new EmbedBuilder()
            .setTitle(`${client.emojisData.star || ""} Leaderboard del servidor`)
            .setColor("Blue")
            .setDescription(
                leaderboard.map((u, i) => `${i+1}. <@${u.userId}> — \`${abbreviateNumber(u.total)} 💰\``).join("\n")
            );

        message.channel.send({ embeds: [embed] });
    }
};
