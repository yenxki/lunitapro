const { EmbedBuilder } = require("discord.js");
const economyManager = require("../../utils/economyManager");

let cooldowns = new Map(); // userId → timestamp

module.exports = {
    name: "daily",
    aliases: ["diario", "claim"],
    category: "Economía",
    description: "Reclama tu recompensa diaria",
    run: (client, message) => {
        const userId = message.author.id;
        const guildId = message.guild.id;

        const now = Date.now();
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas

        if (cooldowns.has(userId) && now - cooldowns.get(userId) < cooldownTime) {
            const remaining = cooldownTime - (now - cooldowns.get(userId));
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("⏳ Espera un poco")
                        .setDescription(`Ya has reclamado tu recompensa diaria. Vuelve en **${hours}h ${minutes}m**.`)
                ]
            });
        }

        const reward = Math.floor(Math.random() * (5000 - 1000) + 1000); // 1k - 5k
        economyManager.addBalance(userId, guildId, reward);
        cooldowns.set(userId, now);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎁 Recompensa diaria")
            .setDescription(`Has reclamado **${economyManager.formatBalance(reward)}** monedas.`);

        message.channel.send({ embeds: [embed] });
    }
};
