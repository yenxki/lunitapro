const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "balance",
    aliases: ["bal", "money"],
    description: "Muestra tu saldo actual",
    usage: "balance [@usuario]",
    category: "Economy",
    run: async (client, message, args, prefix) => {
        const user = message.mentions.users.first() || message.author;
        const guildId = message.guild.id;

        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][user.id]) eco[guildId][user.id] = { wallet: 0, bank: 0 };

        const data = eco[guildId][user.id];

        const embed = new EmbedBuilder()
            .setTitle(`${client.emojisData.star || ""} Economía de ${user.tag}`)
            .setColor("Blue")
            .setDescription(`**Saldo en billetera:** \`${abbreviateNumber(data.wallet)} 💰\`\n**Saldo en banco:** \`${abbreviateNumber(data.bank)} 🏦\``)
            .setFooter({ text: `Usa ${prefix}help para más comandos de economía` });

        message.channel.send({ embeds: [embed] });
    }
};
