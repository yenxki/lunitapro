const { EmbedBuilder } = require("discord.js");
const economyManager = require("../../utils/economyManager");

module.exports = {
    name: "balance",
    aliases: ["bal", "dinero", "coins"],
    category: "Economía",
    description: "Muestra tu saldo actual de monedas",
    run: (client, message) => {
        const rawBalance = economyManager.getBalance(message.author.id, message.guild.id);
        const formattedBalance = economyManager.formatBalance(rawBalance);

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("💰 Tu saldo")
            .setDescription(`Tienes **${formattedBalance} monedas** en este servidor.`)
            .setFooter({ text: "Sistema de economía de Lunita" });

        message.channel.send({ embeds: [embed] });
    }
};
