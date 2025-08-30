const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "Muestra el ranking de riqueza del servidor",
    usage: "leaderboard",
    category: "Economy",
    run: async(client,message) => {
        const ecoFile = "./data/economy.json";
        let eco = JSON.parse(fs.readFileSync(ecoFile,"utf8"));
        if(!eco[message.guild.id]) return message.channel.send("❌ No hay datos de economía en este servidor.");

        const sorted = Object.entries(eco[message.guild.id])
            .map(([userId,data])=>({ userId, total: data.wallet+data.bank }))
            .sort((a,b)=>b.total-a.total)
            .slice(0,10);

        const embed = new EmbedBuilder()
            .setTitle("🏆 Leaderboard")
            .setColor("Gold")
            .setDescription(
                sorted.map((u,i)=>`${i+1}. <@${u.userId}> - ${abbreviateNumber(u.total)} 💰`).join("\n")
            );
        message.channel.send({ embeds:[embed] });
    }
};
