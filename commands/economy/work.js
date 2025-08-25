const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const { formatNumber } = require('../../utils/formatter');
const { checkCooldown } = require('../../utils/cooldown');

module.exports = {
  name: 'work',
  aliases: ['trabajar'],
  description: 'Trabaja y gana dinero con cooldown.',
  usage: '!work',
  run: (client, message) => {
    const cooldownTime = 3600000; // 1 hora
    const remaining = checkCooldown(message.author.id, 'work', cooldownTime);

    if (remaining) {
      const minutes = Math.floor(remaining / 60000);
      return message.channel.send(`⏳ Debes esperar **${minutes} minutos** para volver a trabajar.`);
    }

    const jobs = ['Streamer', 'Creador de memes', 'Programador', 'Minero de Bitcoin', 'Youtuber'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const earnings = Math.floor(Math.random() * 500) + 200;

    if (!db[message.author.id]) db[message.author.id] = { money: 0, inventory: [] };
    db[message.author.id].money += earnings;
    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor('#3B82F6')
      .setDescription(`👔 Trabajaste como **${job}** y ganaste **${formatNumber(earnings)}** monedas.`)
      .setFooter({ text: `Saldo actual: ${formatNumber(db[message.author.id].money)}` });

    message.channel.send({ embeds: [embed] });
  },
};
