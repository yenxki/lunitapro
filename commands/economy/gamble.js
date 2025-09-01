const { abbreviate, loadEconomy, saveEconomy } = require("../../utils/economy");

module.exports = {
  name: "gamble",
  description: "Apuesta una cantidad de LuluCoins y gana o pierde al azar.",
  category: "Economia",
  cooldown: 30,
  async execute({ client, message, args, createEmbed }) {
    const data = loadEconomy();
    const userId = message.author.id;
    if (!data[userId]) data[userId] = 0;

    const amount = parseInt(args[0]);
    if (!amount || amount <= 0) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes ingresar una cantidad válida para apostar.", "❌ Error")] });
    if (amount > data[userId]) return message.channel.send({ embeds: [createEmbed(message.guild, "No tienes suficientes LuluCoins.", "❌ Error")] });

    const win = Math.random() < 0.5;
    if (win) data[userId] += amount;
    else data[userId] -= amount;

    saveEconomy(data);

    const embed = createEmbed(
      message.guild,
      `\`\`\`${win ? "¡Ganaste!" : "Perdiste!"} ${client.config.economyEmoji} ${abbreviate(amount)} LuluCoins\`\`\``,
      `🎲 Apuesta`
    );

    message.channel.send({ embeds: [embed] });
  }
};
