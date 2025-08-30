const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");
const { checkCooldown } = require("../../handlers/cooldowns");

module.exports = {
    name: "daily",
    aliases: [],
    description: "Reclama tu recompensa diaria",
    usage: "daily",
    category: "Economy",
    run: async (client, message, args, prefix) => {
        const user = message.author;
        const guildId = message.guild.id;
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas

        const timeLeft = checkCooldown(user.id, "daily", cooldownTime);
        if (timeLeft) {
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`${client.emojisData.info} Ya reclamaste tu daily. Vuelve en ${hours}h ${minutes}m.`)
                ]
            });
        }

        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][user.id]) eco[guildId][user.id] = { wallet: 0, bank: 0 };

        const amount = Math.floor(Math.random() * 500) + 500;
        eco[guildId][user.id].wallet += amount;

        fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${client.emojisData.success} Recompensa diaria`)
                    .setColor("Green")
                    .setDescription(`Has recibido **${abbreviateNumber(amount)} 💰**!\nTu billetera ahora tiene \`${abbreviateNumber(eco[guildId][user.id].wallet)} 💰\``)
            ]
        });
    }
};
