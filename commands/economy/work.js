const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

module.exports = {
  name: "work",
  description: "Trabaja para ganar LuluCoins.",
  category: "Economy",
  cooldown: 60, // 1 minuto
  async execute({ client, message, args, createEmbed }) {
    // 🔹 Cooldown específico del comando
    if (!client.cooldowns.has(this.name)) client.cooldowns.set(this.name, new Map());
    const now = Date.now();
    const timestamps = client.cooldowns.get(this.name);
    const cooldownAmount = this.cooldown * 1000;

    if (!message.member.permissions.has("Administrator")) {
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = Math.ceil((expirationTime - now) / 1000);
          return message.channel.send({
            embeds: [createEmbed(message.guild, `⏳ Espera **${timeLeft}s** para volver a usar este comando.`, "Cooldown")]
          });
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // 🔹 Lógica principal del comando
    const data = loadEconomy();
    const userId = message.author.id;

    const earnings = Math.floor(Math.random() * 1000) + 100;

    if (!data[userId]) data[userId] = 0;
    data[userId] += earnings;
    saveEconomy(data);

    const embed = createEmbed(
      message.guild,
      `\`\`\`Has trabajado y ganado ${client.config.economyEmoji} ${abbreviate(earnings)} LuluCoins!\`\`\``,
      "💼 Trabajo realizado"
    );

    message.channel.send({ embeds: [embed] });
  }
};
