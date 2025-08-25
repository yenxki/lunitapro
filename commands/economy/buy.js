const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const shop = require('../../data/shop.json');

module.exports = {
  name: 'buy',
  aliases: ['comprar'],
  description: 'Compra un artículo de la tienda.',
  usage: '!buy <item>',
  run: (client, message, args) => {
    const item = args[0];
    if (!item || !shop[item]) return message.channel.send('❌ Ese artículo no existe.');

    if (!db[message.author.id]) db[message.author.id] = { money: 0, inventory: [] };

    if (db[message.author.id].money < shop[item].price) return message.channel.send('❌ No tienes suficiente dinero.');

    db[message.author.id].money -= shop[item].price;
    db[message.author.id].inventory.push(shop[item].name);
    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor('#10B981')
      .setDescription(`✅ Has comprado **${shop[item].name}** por 🪙 ${shop[item].price}.`)
      .setFooter({ text: `Saldo actual: ${db[message.author.id].money}` });

    message.channel.send({ embeds: [embed] });
  },
};
