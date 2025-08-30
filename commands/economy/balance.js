const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "balance",
    aliases: ["bal"],
    description: "Muestra tu saldo de wallet y banco",
    usage: "balance",
    category: "Economy",
    run: async(client, message) => {
        const ecoFile = "./data/economy.json";
        let eco = JSON.parse(fs.readFileSync(ecoFile,"utf8"));

        if(!eco[message.guild.id] || !eco[message.guild.id][message.author.id]){
            eco[message.guild.id] = eco[message.guild.id] || {};
            eco[message.guild.id][message.author.id] = { wallet: 0, bank: 0 };
            fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
        }

        const userEco = eco[message.guild.id][message.author.id];
        const embed = new EmbedBuilder()
            .setTitle("💰 Tu balance")
            .setColor("Blue")
            .addFields(
                { name: "Wallet", value: `${abbreviateNumber(userEco.wallet)} 💰`, inline: true },
                { name: "Bank", value: `${abbreviateNumber(userEco.bank)} 🏦`, inline: true }
            );
        message.channel.send({ embeds: [embed] });
    }
};
