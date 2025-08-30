const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

const workCooldowns = new Map();

module.exports = {
    name: "work",
    aliases: [],
    description: "Gana dinero trabajando",
    usage: "work",
    category: "Economy",
    run: async (client, message, args) => {

        const userId = message.author.id;
        const now = Date.now();
        const cooldownAmount = 30 * 60 * 1000; // 30 minutos

        if (workCooldowns.has(userId)) {
            const expirationTime = workCooldowns.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const remaining = Math.ceil((expirationTime - now) / 60000);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription(`⏳ Debes esperar ${remaining} minuto(s) antes de trabajar de nuevo.`)
                    ]
                });
            }
        }

        workCooldowns.set(userId, now);
        setTimeout(() => workCooldowns.delete(userId), cooldownAmount);

        const guildId = message.guild.id;
        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][userId]) eco[guildId][userId] = { wallet: 0, bank: 0 };

        // Cargar trabajos
        const jobs = JSON.parse(fs.readFileSync("./data/workJobs.json", "utf8"));
        const jobKeys = Object.keys(jobs);
        const chosenJobKey = jobKeys[Math.floor(Math.random() * jobKeys.length)];
        const job = jobs[chosenJobKey];

        // Ganancia aleatoria según rango del trabajo
        const earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
        eco[guildId][userId].wallet += earnings;
        fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

        // Mensaje aleatorio del trabajo
        const messageTemplate = job.messages[Math.floor(Math.random() * job.messages.length)];
        const finalMessage = messageTemplate.replace("{money}", abbreviateNumber(earnings));

        // Embed profesional
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${job.emoji} Trabajo completado`)
            .setDescription(`${finalMessage}\nTu billetera ahora tiene \`${abbreviateNumber(eco[guildId][userId].wallet)} 💰\``);

        message.channel.send({ embeds: [embed] });
    }
};
