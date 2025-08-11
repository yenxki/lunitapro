const { EmbedBuilder } = require("discord.js");
const economyManager = require("../../utils/economyManager");

let cooldowns = new Map(); // userId → timestamp

module.exports = {
    name: "work",
    aliases: ["trabajar", "job"],
    category: "Economía",
    description: "Trabaja para ganar monedas",
    run: (client, message) => {
        const userId = message.author.id;
        const guildId = message.guild.id;

        const now = Date.now();
        const cooldownTime = 60 * 60 * 1000; // 1 hora

        if (cooldowns.has(userId) && now - cooldowns.get(userId) < cooldownTime) {
            const remaining = cooldownTime - (now - cooldowns.get(userId));
            const minutes = Math.floor(remaining / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("⏳ Espera un poco")
                        .setDescription(`Ya has trabajado. Vuelve en **${minutes}m ${seconds}s**.`)
                ]
            });
        }

        const jobs = [
            "Programador",
            "Cajero",
            "Streamer",
            "Minero",
            "Cocinero",
            "Vendedor",
            "Diseñador gráfico",
            "Músico callejero"
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const salary = Math.floor(Math.random() * (2000 - 500) + 500); // 500 - 2k

        economyManager.addBalance(userId, guildId, salary);
        cooldowns.set(userId, now);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("💼 Has trabajado")
            .setDescription(`Has trabajado como **${job}** y ganaste **${economyManager.formatBalance(salary)}** monedas.`);

        message.channel.send({ embeds: [embed] });
    }
};
