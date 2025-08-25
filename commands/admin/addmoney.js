const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const { formatNumber } = require('../../utils/formatter');

module.exports = {
  name: 'addmoney',
  aliases: ['addcoins', 'givemoney'],
  description: 'Agrega dinero a un usuario (solo administradores).',
  usage: '!addmoney @usuario <cantidad>',
  run: (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor('#DC2626').setDescription('🚫 **No tienes permisos para usar este comando.**')
      ]});
    }

    const user = message.mentions.users.first();
    if (!user) return message.channel.send('❌ Debes mencionar a un usuario.');
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) return message.channel.send('❌ Debes indicar una cantidad válida.');

    if (!db[user.id]) db[user.id] = { money: 0 };
    db[user.id].money += amount;
    fs.writeFileSync('./data/economy.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor('#22C55E')
      .setAuthor({ name: '✅ Dinero agregado', iconURL: user.displayAvatarURL() })
      .setDescription(
        `Has agregado **${formatNumber(amount)}** monedas a **${user.username}**.\n` +
        `Nuevo balance: 🪙 **${formatNumber(db[user.id].money)}**`
      )
      .setFooter({ text: `Acción realizada por ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
