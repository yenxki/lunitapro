const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const { formatNumber } = require('../../utils/formatter');

module.exports = {
  name: 'pay',
  aliases: ['give'],
  description: 'Envía dinero a otro usuario.',
  usage: '!pay @usuario <cantidad>',
  run: (client, message, args) => {
    const user = message.mentions.users.first();
    if (!user) return message.channel.send('❌ Debes mencionar a alguien.');
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) return message.channel.send('❌ Cantidad inválida.');

    if (!db[message.author.id]) db[message.author.id] = { money: 0, inventory: [] };
    if (!db[user.id]) db[user.id] = { money: 0, inventory: [] };

    if (db[message.author.id].money < amount) return message.channel.send('❌ No tienes suficiente dinero.');

    db[message.author.id].money -= amount;
    db[user.id].money += amount;

    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor('#10B981')
      .setDescription(`✅ Has enviado **${formatNumber(amount)}** monedas a **${user.username}**.`)
      .setFooter({ text: `Saldo actual: ${formatNumber(db[message.author.id].money)}` });

    message.channel.send({ embeds: [embed] });
  },
};
