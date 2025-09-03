const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

module.exports = {
  name: "rob",
  description: "Intenta robar LuluCoins de otro usuario.",
  category: "Economia",
  _enfriacion: new Map(), // 🔹 Sistema propio de cooldown

  async execute({ client, message, args, createEmbed }) {
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
    if (!args[0]) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a alguien para robar.", "❌ Error")] });

    const target = message.mentions.members.first();
    if (!target || target.id === message.author.id) return message.channel.send({ embeds: [createEmbed(message.guild, "No puedes robarte a ti mismo.", "❌ Error")] });

    const data = loadEconomy();
    const thief = message.author.id;
    const victim = target.id;

    if (!data[victim] || data[victim] <= 0) return message.channel.send({ embeds: [createEmbed(message.guild, "Esta persona no tiene LuluCoins.", "❌ Error")] });

    // 🔹 Posibilidad de fallo 50%
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
