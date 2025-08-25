const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const { formatNumber } = require('../../utils/formatter');
const config = require('../../config.json');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'money'],
  description: 'Muestra tu balance o el de otro usuario.',
  usage: '!balance [@usuario]',
  run: (client, message, args) => {
    const prefix = client.prefixes[message.guild.id] || config.defaultPrefix;
    const user = message.mentions.users.first() || message.author;

    if (!db[user.id]) db[user.id] = { money: 0, inventory: [] };
    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor('#0EA5E9')
      .setAuthor({ name: `💰 Economía | Balance`, iconURL: user.displayAvatarURL() })
      .setDescription(
        `**Usuario:** ${user.username}\n` +
        `**Monedas:** 🪙 \`${formatNumber(db[user.id].money)}\`\n\n` +
        `ℹ️ Usa \`${prefix}addmoney <cantidad>\` si eres admin.`
      )
      .setFooter({ text: `Solicitado por ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
