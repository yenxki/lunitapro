const { abbreviate, loadEconomy } = require("../../utils/economy");

module.exports = {
  name: "leaderboard",
  description: "Muestra los usuarios con más LuluCoins.",
  category: "Economia",
  async execute({ client, message, createEmbed }) {
    const data = loadEconomy();

    // Convertimos el objeto en array y ordenamos por coins descendente
    const sorted = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10

    if (sorted.length === 0) {
      return message.channel.send({ embeds: [createEmbed(message.guild, "No hay datos de LuluCoins aún.", "💰 Leaderboard")] });
    }

    // Formateamos la lista
    const leaderboard = await Promise.all(sorted.map(async ([userId, coins], index) => {
      const user = await client.users.fetch(userId).catch(() => ({ tag: "Usuario no encontrado" }));
      return `\`${index + 1}.\` **${user.tag}** - ${client.config.economyEmoji} ${abbreviate(coins)}`;
    }));

    const embed = createEmbed(
      message.guild,
      leaderboard.join("\n"),
      "🏆 Top 10 LuluCoins"
    );

    message.channel.send({ embeds: [embed] });
  }
};
