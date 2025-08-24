const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildConfig } = require('../utils/db');

module.exports = {
  name: 'setprefix',
  category: 'Configuración',
  description: 'Cambia el prefix del servidor.',
  usage: '!setprefix <nuevoPrefix>',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE74C3C).setTitle('＜:lock_IDS:1403559848318205984＞ Solo administradores')
      ]});
    }
    const newPrefix = args[0];
    if (!newPrefix) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE67E22).setDescription('Uso: `!setprefix <nuevoPrefix>`')
      ]});
    }
    const cfg = setGuildConfig(message.guild.id, { prefix: newPrefix });
    return message.channel.send({ embeds: [
      new EmbedBuilder().setColor(0x2ECC71).setDescription(`Prefix actualizado a \`${cfg.prefix}\``)
    ]});
  }
};
