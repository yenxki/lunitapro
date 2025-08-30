const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

// Map para cooldown por usuario
const cooldowns = new Map();

module.exports = {
    name: "geratest",
    aliases: [],
    description: "Pregunta interactiva sobre Gera con recompensa",
    usage: "geratest",
    category: "Fun",
    run: async (client, message, args, prefix) => {

        const userId = message.author.id;
        const now = Date.now();
        const cooldownAmount = 10 * 60 * 1000; // 10 minutos en ms

        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const remaining = Math.ceil((expirationTime - now) / 60000);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription(`⏳ Debes esperar ${remaining} minuto(s) antes de usar este comando de nuevo.`)
                    ]
                });
            }
        }

        // Registrar el tiempo de uso
        cooldowns.set(userId, now);
        setTimeout(() => cooldowns.delete(userId), cooldownAmount);

        // Lista de preguntas y respuestas
        const questions = [
            { q: "¿Cuál es el apodo de Gerasaurio?", a: "Gera" },
            { q: "¿En qué plataforma es streamer principalmente?", a: "TikTok" },
            { q: "¿Cuál es el color favorito de Gera?", a: "azul" },
            // Más preguntas aquí
        ];

        const question = questions[Math.floor(Math.random() * questions.length)];

        const embed = new EmbedBuilder()
            .setTitle(`${client.emojisData.star || ""} Prueba de conocimiento de Gera`)
            .setDescription(`¿Quieres probar a responder una pregunta sobre Gera y ganar una recompensa de 1K-10K?`)
            .setColor("Purple");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("geratest_button")
                .setLabel("Si")
                .setStyle(ButtonStyle.Primary)
        );

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        setTimeout(() => msg.delete().catch(() => {}), 30000);

        const filter = i => i.customId === "geratest_button";
        const collector = msg.createMessageComponentCollector({ filter, time: 30000, max: 1 });

        collector.on("collect", async i => {
            if (i.user.id !== userId) {
                return i.reply({ content: "Solo el usuario que ejecutó el comando puede responder.", ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId("geratest_modal")
                .setTitle("Pregunta sobre Gera")
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("respuesta")
                            .setLabel(question.q)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setPlaceholder("Introduce tu respuesta aquí")
                    )
                );

            await i.showModal(modal);

            const modalListener = async modalInteraction => {
                if (!modalInteraction.isModalSubmit()) return;
                if (modalInteraction.customId !== "geratest_modal") return;
                if (modalInteraction.user.id !== i.user.id) return;

                if (msg.metadata && msg.metadata.answered) {
                    return modalInteraction.reply({ content: "Alguien ya respondió a esta pregunta.", ephemeral: true });
                }

                msg.metadata = { answered: true };

                const userAnswer = modalInteraction.fields.getTextInputValue("respuesta").trim().toLowerCase();
                const correctAnswer = question.a.toLowerCase();

                if (userAnswer === correctAnswer) {
                    const reward = Math.floor(Math.random() * 9000) + 1000; // 1K-10K
                    const guildId = message.guild.id;
                    let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
                    if (!eco[guildId]) eco[guildId] = {};
                    if (!eco[guildId][modalInteraction.user.id]) eco[guildId][modalInteraction.user.id] = { wallet: 0, bank: 0 };
                    eco[guildId][modalInteraction.user.id].wallet += reward;
                    fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

                    modalInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Green")
                                .setTitle(`${client.emojisData.success} Correcto!`)
                                .setDescription(`¡Has respondido correctamente y recibido **${abbreviateNumber(reward)} 💰**!\nTu billetera ahora tiene \`${abbreviateNumber(eco[guildId][modalInteraction.user.id].wallet)} 💰\``)
                        ],
                        ephemeral: true
                    });
                } else {
                    modalInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle(`${client.emojisData.error} Incorrecto`)
                                .setDescription(`La respuesta correcta era: \`${question.a}\``)
                        ],
                        ephemeral: true
                    });
                }

                msg.edit({ embeds: [embed.setDescription("Alguien ya respondió a esta pregunta.")], components: [] }).catch(() => {});
                client.removeListener("interactionCreate", modalListener);
            };

            client.on("interactionCreate", modalListener);
        });
    }
};
