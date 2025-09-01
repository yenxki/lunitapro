const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

module.exports = {
  name: "rob",
  description: "Intenta robar LuluCoins de otro usuario.",
  category: "Economy",
  cooldown: 120, // 2 minutos
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
    if (!args[0]) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a alguien para robar.", "❌ Error")] });

    const target = message.mentions.members.first();
    if (!target || target.id === message.author.id) return message.channel.send({ embeds: [createEmbed(message.guild, "No puedes robarte a ti mismo.", "❌ Error")] });

    const data = loadEconomy();
    const thief = message.author.id;
    const victim = target.id;

    if (!data[victim] || data[victim] <= 0) return message.channel.send({ embeds: [createEmbed(message.guild, "Esta persona no tiene LuluCoins.", "❌ Error")] });

    // 🔹 Posibilidad de fallar 50%
    if (Math.random() < 0.5) {
      return message.channel.send({
        embeds: [createEmbed(message.guild, `❌ ${message.author.tag} intentó robar a ${target.user.tag}, pero falló!`, "Robo fallido")]
      });
    }

    const stolen = Math.floor(Math.random() * Math.min(500, data[victim])) + 1;

    if (!data[thief]) data[thief] = 0;
    data[thief] += stolen;
    data[victim] -= stolen;
    saveEconomy(data);

    const embed = createEmbed(
      message.guild,
      `\`\`\`${message.author.tag} robó ${client.config.economyEmoji} ${abbreviate(stolen)} LuluCoins de ${target.user.tag}!\`\`\``,
      "💸 Robo exitoso"
    );

    message.channel.send({ embeds: [embed] });
  }
};
