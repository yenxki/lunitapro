const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

// Preguntas aleatorias
const questions = [
  { question: "¿Cuál es el cantante favorito de Gera?", answer: "Humbe" },
  { question: "¿Cuál es la capital de Paris?", answer: "Paris" },
  { question: "¿Qué color resulta de mezclar rojo y azul?", answer: "morado" },
  { question: "¿Cuánto es 10 / 2?", answer: "5" },
  { question: "¿En qué continente está Brasil?", answer: "américa" }
];

// Cooldowns globales
const serverCooldowns = new Map();

module.exports = {
  name: "gera",
  description: "Evento especial para ganar LuluCoins resolviendo preguntas sobre Gera.",
  category: "Economia",
  async execute({ client, message, createEmbed }) {
    const guildId = message.guild.id;
    const now = Date.now();

    if (serverCooldowns.has(guildId)) {
      const expiration = serverCooldowns.get(guildId);
      if (now < expiration) {
        const timeLeft = Math.ceil((expiration - now)/1000/60);
        return message.channel.send({ embeds: [createEmbed(message.guild, `⏳ Este evento ya se ha usado. Espera ${timeLeft} minutos.`)] });
      }
    }

    serverCooldowns.set(guildId, now + 10*60*1000); // 10 minutos cooldown

    const mainEmbed = createEmbed(
      message.guild,
      "Tienes la oportunidad de responder una pregunta correctamente y ganar entre `10k-50k LuluCoins`!",
      "🎯 ¡Reto Gera!"
    );

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("accept_gera")
        .setStyle(ButtonStyle.Success)
        .setLabel("Acepto")
    );

    const sentMessage = await message.channel.send({ embeds: [mainEmbed], components: [buttonRow] });

    const collector = sentMessage.createMessageComponentCollector({ time: 600000 }); // 10 minutos

    collector.on("collect", async i => {
      if (i.customId !== "accept_gera") return;

      // Generar pregunta aleatoria
      const q = questions[Math.floor(Math.random() * questions.length)];

      const modal = new ModalBuilder()
        .setCustomId(`gera_modal_${i.user.id}`)
        .setTitle("Reto Gera")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("answer")
              .setLabel(q.question)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Escribe tu respuesta aquí")
              .setRequired(true)
          )
        );

      await i.showModal(modal);
    });

    client.on("interactionCreate", async interaction => {
      if (!interaction.isModalSubmit()) return;
      if (!interaction.customId.startsWith("gera_modal_")) return;

      const userId = interaction.user.id;
      const guildId = interaction.guild.id;

      // Evitar que otros respondan si ya hay un ganador
      const embedMessage = await interaction.channel.messages.fetch(sentMessage.id);
      if (!embedMessage) return;

      const embedData = embedMessage.embeds[0];
      if (embedData.description.includes("ya fue completado")) return interaction.reply({ content: "❌ Este reto ya fue completado.", ephemeral: true });

      const q = questions.find(q => interaction.fields.getTextInputValue("answer").toLowerCase() === q.answer.toLowerCase());
      if (q) {
        // Respuesta correcta
        const reward = Math.floor(Math.random() * (50000 - 10000 +1)) + 10000;

        const data = loadEconomy();
        if (!data[userId]) data[userId] = 0;
        data[userId] += reward;
        saveEconomy(data);

        const updatedEmbed = createEmbed(
          interaction.guild,
          `🎉 ${interaction.user.tag} ha completado el reto y ganó ${client.config.economyEmoji} ${abbreviate(reward)} LuluCoins!`,
          "🏆 Reto completado"
        );

        await embedMessage.edit({ embeds: [updatedEmbed], components: [] });
        return interaction.reply({ content: `✅ Respuesta correcta! Has ganado ${client.config.economyEmoji} ${abbreviate(reward)} LuluCoins!`, ephemeral: true });
      } else {
        return interaction.reply({ content: `❌ Respuesta incorrecta! Intenta de nuevo o alguien más podrá tomar la oportunidad.`, ephemeral: true });
      }
    });
  }
};
