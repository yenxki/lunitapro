const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');

module.exports = {
  name: 'inventory',
  aliases: ['inv'],
  description: 'Muestra tu inventario.',
  usage: '!inventory',
  run: (client, message) => {
    if (!db[message.author.id]) db[message.author.id] = { money: 0, inventory: [] };

    const inventory = db[message.author.id].inventory.length ? db[message.author.id].inventory.join(', ') : 'Vacío';

    const embed = new EmbedBuilder()
      .setColor('#F59E0B')
      .setDescription(`🎒 **Inventario de ${message.author.username}**\n${inventory}`);

    message.channel.send({ embeds: [embed] });
  },
};
