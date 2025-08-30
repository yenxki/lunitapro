const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "withdraw",
    aliases: ["with"],
    description: "Retira dinero de tu banco",
    usage: "withdraw <cantidad/all>",
    category: "Economy",
    run: async (client, message, args) => {
        const user = message.author;
        const guildId = message.guild.id;
        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][user.id]) eco[guildId][user.id] = { wallet: 0, bank: 0 };

        let amount = args[0];
        if (!amount) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`${client.emojisData.info} Debes especificar una cantidad.`)] });

        if (amount.toLowerCase() === "all") amount = eco[guildId][user.id].bank;
        else amount = parseInt(amount);

        if (isNaN(amount) || amount < 1) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`${client.emojisData.info} Cantidad inválida.`)] });
        if (eco[guildId][user.id].bank < amount) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription(`${client.emojisData.error} No tienes suficiente dinero en el banco.`)] });

        eco[guildId][user.id].bank -= amount;
        eco[guildId][user.id].wallet += amount;

        fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

        message.channel.send({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`${client.emojisData.success} Has retirado **${abbreviateNumber(amount)} 💰** de tu banco.`)] });
    }
};
