const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const shop = require('../../data/shop.json'); // Lista de items (creamos más abajo)
const config = require('../../config.json');

module.exports = {
  name: 'shop',
  aliases: ['tienda'],
  description: 'Muestra la tienda.',
  usage: '!shop',
  run: (client, message) => {
    const prefix = client.prefixes[message.guild.id] || config.defaultPrefix;

    const items = Object.keys(shop).map(key => `**${key}** - ${shop[key].name} | Precio: 🪙 ${shop[key].price}`).join('\n');

    const embed = new EmbedBuilder()
      .setColor('#8B5CF6')
      .setAuthor({ name: '🛒 Tienda', iconURL: message.guild.iconURL() })
      .setDescription(`Compra artículos con \`${prefix}buy <item>\`\n\n${items}`)
      .setFooter({ text: `Solicitado por ${message.author.tag}` });

    message.channel.send({ embeds: [embed] });
  },
};
