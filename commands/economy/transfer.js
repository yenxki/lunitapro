const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "transfer",
    aliases: ["pay", "dar"],
    description: "Transfiere dinero a otro usuario",
    usage: "transfer <@usuario> <cantidad>",
    category: "Economy",
    run: async (client, message, args, prefix) => {
        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!target) return message.channel.send({ embeds: [
            new EmbedBuilder().setColor("Yellow").setDescription(`${client.emojisData.info} Debes mencionar a un usuario.`)
        ]});

        if (!amount || amount < 1) return message.channel.send({ embeds: [
            new EmbedBuilder().setColor("Yellow").setDescription(`${client.emojisData.info} Debes especificar una cantidad válida.`)
        ]});

        const guildId = message.guild.id;
        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][message.author.id]) eco[guildId][message.author.id] = { wallet: 0, bank: 0 };
        if (!eco[guildId][target.id]) eco[guildId][target.id] = { wallet: 0, bank: 0 };

        if (eco[guildId][message.author.id].wallet < amount) return message.channel.send({ embeds: [
            new EmbedBuilder().setColor("Red").setDescription(`${client.emojisData.error} No tienes suficiente dinero.`)
        ]});

        eco[guildId][message.author.id].wallet -= amount;
        eco[guildId][target.id].wallet += amount;

        fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

        message.channel.send({ embeds: [
            new EmbedBuilder()
                .setColor("Green")
                .setTitle(`${client.emojisData.success} Transferencia realizada`)
                .setDescription(`Has enviado **${abbreviateNumber(amount)} 💰** a ${target.tag}.\nTu saldo ahora es \`${abbreviateNumber(eco[guildId][message.author.id].wallet)} 💰\``)
        ]});
    }
};
