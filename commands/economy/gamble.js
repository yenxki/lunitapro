const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');

module.exports = {
  name: 'gamble',
  aliases: ['apostar'],
  description: 'Apuesta tus monedas con un 50% de ganar o perder.',
  usage: '!gamble <cantidad>',
  run: (client, message, args) => {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return message.channel.send('❌ Cantidad inválida.');

    if (!db[message.author.id]) db[message.author.id] = { money: 0, inventory: [] };

    if (db[message.author.id].money < amount) return message.channel.send('❌ No tienes suficiente dinero.');

    const win = Math.random() < 0.5;
    if (win) {
      db[message.author.id].money += amount;
      result = `🎉 ¡Ganaste **${amount}** monedas!`;
    } else {
      db[message.author.id].money -= amount;
      result = `💀 Perdiste **${amount}** monedas...`;
    }

    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor(win ? '#22C55E' : '#EF4444')
      .setDescription(result);

    message.channel.send({ embeds: [embed] });
  },
};
