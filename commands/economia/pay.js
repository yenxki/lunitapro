const { EmbedBuilder } = require("discord.js");
const economyManager = require("../../utils/economyManager");

module.exports = {
    name: "pay",
    aliases: ["pagar", "transferir", "give"],
    category: "Economía",
    description: "Envía monedas a otro usuario",
    run: (client, message, args) => {
        const target = message.mentions.users.first();
        if (!target) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Error")
                        .setDescription("Debes mencionar a un usuario válido.")
                ]
            });
        }

        if (target.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Error")
                        .setDescription("No puedes enviarte monedas a ti mismo.")
                ]
            });
        }

        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Error")
                        .setDescription("Debes indicar una cantidad a transferir.")
                ]
            });
        }

        const amount = economyManager.parseBalance(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Error")
                        .setDescription("Cantidad inválida.")
                ]
            });
        }

        const balance = economyManager.getBalance(message.author.id, message.guild.id);
        if (amount > balance) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Fondos insuficientes")
                        .setDescription(`Tu saldo actual es de **${economyManager.formatBalance(balance)}**.`)
                ]
            });
        }

        // Transferencia
        economyManager.addBalance(target.id, message.guild.id, amount);
        economyManager.setBalance(message.author.id, message.guild.id, balance - amount);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("💸 Transferencia realizada")
            .setDescription(`Has enviado **${economyManager.formatBalance(amount)}** a ${target.username}.`);

        message.channel.send({ embeds: [embed] });
    }
};
