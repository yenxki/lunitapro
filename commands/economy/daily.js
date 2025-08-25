const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const { formatNumber } = require('../../utils/formatter');
const { checkCooldown } = require('../../utils/cooldown');

module.exports = {
  name: 'daily',
  aliases: ['diario'],
  description: 'Recibe tu recompensa diaria.',
  usage: '!daily',
  run: (client, message) => {
    const cooldownTime = 86400000; // 24 horas
    const remaining = checkCooldown(message.author.id, 'daily', cooldownTime);

    if (remaining) {
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      return message.channel.send(`⏳ Debes esperar **${hours}h ${minutes}m** para reclamar de nuevo.`);
    }

    const reward = Math.floor(Math.random() * 1000) + 500;

    if (!db[message.author.id]) db[message.author.id] = { money: 0, inventory: [] };
    db[message.author.id].money += reward;
    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor('#F59E0B')
      .setDescription(`🎁 Has reclamado tu recompensa diaria: **${formatNumber(reward)}** monedas.`)
      .setFooter({ text: `Saldo actual: ${formatNumber(db[message.author.id].money)}` });

    message.channel.send({ embeds: [embed] });
  },
};
