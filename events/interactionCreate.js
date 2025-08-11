const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const questions = require("../utils/questions");
const economyManager = require("../utils/economyManager");
const verificationManager = require("../utils/verificationManager");
const { v4: uuidv4 } = require("uuid");

module.exports = async (client, interaction) => {
    // --- Botón de economía ---
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("gera_")) {
            const userId = interaction.customId.split("_")[1];
            if (interaction.user.id !== userId) {
                return interaction.reply({ content: "❌ Este botón no es para ti.", ephemeral: true });
            }

            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            const modal = new ModalBuilder()
                .setCustomId(`geraModal_${userId}`)
                .setTitle("Pregunta rápida");

            const input = new TextInputBuilder()
                .setCustomId("answer")
                .setLabel(randomQuestion.question)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(input);
            modal.addComponents(row);

            interaction.showModal(modal);
            client.tempQuestions = client.tempQuestions || {};
            client.tempQuestions[userId] = randomQuestion.answer.toLowerCase();
        }

        // --- Botón de verificación ---
        if (interaction.customId === "startVerify") {
            const config = verificationManager.getConfig(interaction.guild.id);
            if (!config) {
                return interaction.reply({ content: "❌ El sistema de verificación no está configurado.", ephemeral: true });
            }

            if (verificationManager.isVerified(interaction.guild.id, interaction.user.id)) {
                return interaction.reply({ content: "✅ Ya estás verificado.", ephemeral: true });
            }

            const code = uuidv4().split("-")[0]; // código corto
            client.tempVerifyCodes = client.tempVerifyCodes || {};
            client.tempVerifyCodes[interaction.user.id] = code.toLowerCase();

            const modal = new ModalBuilder()
                .setCustomId(`verifyModal_${interaction.user.id}`)
                .setTitle("Verificación");

            const input = new TextInputBuilder()
                .setCustomId("verifyCode")
                .setLabel(`Escribe este código: ${code}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(input));
            interaction.showModal(modal);
        }
    }

    // --- Modal de economía ---
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith("geraModal_")) {
            const userId = interaction.customId.split("_")[1];
            const givenAnswer = interaction.fields.getTextInputValue("answer").toLowerCase();
            const correctAnswer = client.tempQuestions?.[userId];

            if (interaction.user.id !== userId) {
                return interaction.reply({ content: "❌ Este modal no es para ti.", ephemeral: true });
            }

            if (givenAnswer === correctAnswer) {
                economyManager.addBalance(userId, interaction.guild.id, 50);
                const embed = new EmbedBuilder().setColor("Green").setTitle("✅ ¡Correcto!").setDescription("Has ganado **50 monedas** 🎉");
                return interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder().setColor("Red").setTitle("❌ Incorrecto").setDescription("No has ganado nada esta vez.");
                return interaction.reply({ embeds: [embed] });
            }
        }

        // --- Modal de verificación ---
        if (interaction.customId.startsWith("verifyModal_")) {
            const userId = interaction.customId.split("_")[1];
            const givenCode = interaction.fields.getTextInputValue("verifyCode").toLowerCase();
            const correctCode = client.tempVerifyCodes?.[userId];

            if (interaction.user.id !== userId) {
                return interaction.reply({ content: "❌ Este modal no es para ti.", ephemeral: true });
            }

            if (givenCode === correctCode) {
                const config = verificationManager.getConfig(interaction.guild.id);
                const role = interaction.guild.roles.cache.get(config.roleId);

                if (role) await interaction.member.roles.add(role).catch(() => {});
                verificationManager.markVerified(interaction.guild.id, interaction.user.id);

                const embed = new EmbedBuilder().setColor("Green").setTitle("✅ Verificado").setDescription("¡Bienvenido! Ahora tienes acceso al servidor.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new EmbedBuilder().setColor("Red").setTitle("❌ Código incorrecto").setDescription("Intenta nuevamente.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};
