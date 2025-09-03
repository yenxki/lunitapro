const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

module.exports = {
  name: "work",
  description: "Trabaja para ganar LuluCoins.",
  category: "Economia",
  _enfriacion: new Map(), // 🔹 Sistema propio de cooldown

  async execute({ message, createEmbed, client }) {
    const now = Date.now();
    const cooldowns = this._enfriacion;
    const cooldownAmount = this.cooldown * 1000;

    if (!message.member.permissions.has("Administrator")) {
      if (cooldowns.has(message.author.id)) {
        const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = Math.ceil((expirationTime - now) / 1000);
          return message.channel.send({
            embeds: [createEmbed(message.guild, `⏳ Espera **${timeLeft}s** para volver a usar este comando.`, "Cooldown")]
          });
        }
      }
      cooldowns.set(message.author.id, now);
      setTimeout(() => cooldowns.delete(message.author.id), cooldownAmount);
    }

    // 🔹 Lógica principal
    const data = loadEconomy();
    const userId = message.author.id;
    const earnings = Math.floor(Math.random() * 1000) + 100;

    if (!data[userId]) data[userId] = 0;
    data[userId] += earnings;
    saveEconomy(data);

    // 🔹 Mensajes aleatorios
    const workMessages = [
      "Has trabajado como panadero y horneaste unos deliciosos pasteles.",
      "Has ayudado en la construcción de una casa y ganaste tu pago.",
      "Has trabajado como programador freelance completando un proyecto.",
      "Has entregado paquetes por la ciudad y recibiste tu recompensa.",
      "Has trabajado en un café preparando cafés y bocadillos.",
      "Has enseñado clases particulares y cobraste tu tarifa.",
      "Has trabajado en el mercado vendiendo frutas y verduras frescas.",
      "Has reparado un coche viejo y el dueño te pagó con gusto."
    ];
    const randomMessage = workMessages[Math.floor(Math.random() * workMessages.length)];

    const embed = createEmbed(
      message.guild,
      `\`\`\`${randomMessage} Ganaste ${client.config.economyEmoji} ${abbreviate(earnings)} LuluCoins!\`\`\``,
      "💼 Trabajo realizado"
    );

    message.channel.send({ embeds: [embed] });
  }
};
