const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "deposit",
    aliases: ["dep"],
    description: "Deposita dinero en tu banco",
    usage: "deposit <cantidad/all>",
    category: "Economy",
    run: async (client, message, args) => {
        const user = message.author;
        const guildId = message.guild.id;
        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][user.id]) eco[guildId][user.id] = { wallet: 0, bank: 0 };

        let amount = args[0];
        if (!amount) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`${client.emojisData.info} Debes especificar una cantidad.`)] });

        if (amount.toLowerCase() === "all") amount = eco[guildId][user.id].wallet;
        else amount = parseInt(amount);

        if (isNaN(amount) || amount < 1) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`${client.emojisData.info} Cantidad inválida.`)] });
        if (eco[guildId][user.id].wallet < amount) return message.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription(`${client.emojisData.error} No tienes suficiente dinero en la billetera.`)] });

        eco[guildId][user.id].wallet -= amount;
        eco[guildId][user.id].bank += amount;

        fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

        message.channel.send({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`${client.emojisData.success} Has depositado **${abbreviateNumber(amount)} 💰** en tu banco.`)] });
    }
};
