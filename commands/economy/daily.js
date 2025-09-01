const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

module.exports = {
  name: "daily",
  description: "Obtén tu recompensa diaria de LuluCoins.",
  category: "Economia",
  cooldown: 86400, // 24 horas
  async execute({ client, message, args, createEmbed }) {
    const data = loadEconomy();
    const userId = message.author.id;

    const reward = Math.floor(Math.random() * 5000) + 500;

    if (!data[userId]) data[userId] = 0;
    data[userId] += reward;
    saveEconomy(data);

    const embed = createEmbed(
      message.guild,
      `\`\`\`Has reclamado tu recompensa diaria y obtuviste ${client.config.economyEmoji} ${abbreviate(reward)} LuluCoins!\`\`\``,
      "🎁 Recompensa diaria"
    );

    message.channel.send({ embeds: [embed] });
  }
};
