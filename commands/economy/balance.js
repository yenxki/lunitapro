const { abbreviate, loadEconomy } = require("../../utils/economy");

module.exports = {
  name: "balance",
  description: "Muestra tu balance de LuluCoins.",
  category: "Economia",
  async execute({ client, message, args, createEmbed }) {
    const data = loadEconomy();
    const userId = message.author.id;

    const balance = data[userId] || 0;

    const embed = createEmbed(
      message.guild,
      `\`\`\`Tu balance actual es: ${client.config.economyEmoji} ${abbreviate(balance)} LuluCoins\`\`\``,
      "💰 Balance"
    );

    message.channel.send({ embeds: [embed] });
  }
};
